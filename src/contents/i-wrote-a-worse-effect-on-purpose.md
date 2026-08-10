---
author: Nikos Tsompanidis
datetime: 2026-08-10T09:00:00Z
title: "I wrote a worse Effect on purpose"
slug: i-wrote-a-worse-effect-on-purpose
featured: true
draft: false
tags:
  - Software Engineering
  - TypeScript
  - Functional Programming
  - Error Handling
  - Dependency Injection
ogImage: "https://pewylbljypgmyciygfsg.supabase.co/storage/v1/object/public/photos/nikos-tsompanidis-blog-ogImage.webp"
description: Why I wrote a 284-line library instead of adopting Effect or fp-ts, the four things I got wrong along the way, and the point at which I would abandon it.
---

# I wrote a worse Effect on purpose

Two things bother me about the TypeScript I write for a living.

The first is that **failure is invisible**. A signature promises me a `User` and says nothing about the four ways the function can throw. I find out in production, or I find out by reading the implementation, which rather defeats the purpose of having a signature at all.

The second is how we pass dependencies around. Most of what gets called dependency injection in TypeScript is either a container with decorators and a metadata reflection polyfill, or a module-level singleton that quietly makes everything downstream untestable while we all agree not to mention it.

fp-ts and Effect both solve these properly. I have written enough fp-ts to say that sincerely, and Effect is a genuinely impressive piece of engineering. But adopting either one means everybody on the team learns a new vocabulary before they can fix a bug, and your stack traces stop looking like your code. That cost is real even when the library is excellent, and you pay it on **every single onboarding**.

So I wrote the smallest thing that gives me the two properties I actually use day to day. It came to 284 lines. I called it [pragmatic-effects](https://github.com/NikosTsompanides/pragmatic-effects).

## Two Properties, Three Types

`Result<A, E>` makes failure part of the type. A function that can fail returns the failure instead of throwing it, so the signature stops lying:

```ts
class ConfigError extends Error {}

const parsePort = (raw: string | undefined): Result<number, ConfigError> => {
  if (!raw) return Result.err(new ConfigError("PORT is missing"));
  const port = Number(raw);
  return Number.isInteger(port) && port > 0 && port < 65536
    ? Result.ok(port)
    : Result.err(new ConfigError(`PORT is not a port: ${raw}`));
};
```

Composing those is where it pays off. `flatMap` short-circuits, so a bad port means `DATABASE_URL` is never read at all, and there is no nesting and no ladder of early returns:

```ts
const loadConfig = (env: NodeJS.ProcessEnv): Result<Config, ConfigError> =>
  parsePort(env.PORT).flatMap(port =>
    parseUrl(env.DATABASE_URL).map(databaseUrl => ({ port, databaseUrl }))
  );
```

Nothing above decides what a failure _means_. That happens once, at the edge, and it is the only place in the program that branches on it:

```ts
loadConfig(process.env).run(
  config => startServer(config),
  error => {
    console.error(error.message);
    process.exit(1);
  }
);
```

Which is the actual win. The parser stays reusable and testable because it never reaches for `process.exit` or a logger, and a test asserts on a returned value rather than on a thrown exception.

`AsyncResult<A, E>` is the same idea wrapped around `() => Promise<Result<A, E>>`. Building a chain runs nothing. Calling `run` starts the work.

`Computation<R, A>` is the entire dependency injection story, and its [implementation is eleven lines](https://github.com/NikosTsompanides/pragmatic-effects/blob/main/src/Computation.ts). What matters is how it reads at the call site. Here is a subscription check that names what it needs and imports none of it:

```ts
interface Deps {
  now: () => Date;
  findSubscription: (userId: string) => { expiresAt: Date } | null;
}

const checkAccess = (userId: string) =>
  Computation.create((deps: Deps): Result<string, Error> => {
    const subscription = deps.findSubscription(userId);
    if (!subscription) return Result.err(new Error("no subscription"));
    return subscription.expiresAt > deps.now()
      ? Result.ok("active")
      : Result.err(new Error("subscription expired"));
  });
```

No clock import, no database import, no container. Creating that runs nothing. You hand it the real world at the boundary:

```ts
checkAccess("u1").provide({ now: () => new Date(), findSubscription: db.find });
```

And the test for the expiry boundary, which is the case I always used to get wrong, becomes ordinary. No fake timers, no module mocking, no clock to freeze:

```ts
const expired = checkAccess("u1").provide({
  now: () => new Date("2026-06-01"),
  findSubscription: () => ({ expiresAt: new Date("2026-05-31") }),
});
// Err("subscription expired")
```

Strip away the ceremony and dependency injection is just **a function that has not been called yet**, held as a value. The clock was never a global, so there is nothing to reach in and replace.

Eleven lines replaced the part of my job I disliked most. That result is either encouraging or embarrassing, and I still cannot decide which.

## Ports, Adapters and a Command

Put the two properties together and you land on hexagonal architecture almost by accident. A port is just an interface, and because its async methods return `AsyncResult`, failure is part of the contract rather than a footnote in a docstring:

```ts
interface OrderPort {
  findById: (id: string) => AsyncResult<Order, OrderNotFound>;
  save: (order: Order) => AsyncResult<void, PersistenceError>;
}
```

The domain rule stays synchronous and pure, which is what `Result` is for:

```ts
const applyPercent = (
  order: Order,
  percent: number
): Result<Order, InvalidDiscount> =>
  percent > 0 && percent <= 50
    ? Result.ok({ ...order, total: order.total * (1 - percent / 100) })
    : Result.err(new InvalidDiscount(percent));
```

The command wires them together and returns a `Computation` that needs the port. It imports nothing from infrastructure:

```ts
const discountOrder = (id: string, percent: number) =>
  Computation.create((orders: OrderPort) =>
    orders
      .findById(id)
      .flatMap(order => AsyncResult.fromResult(applyPercent(order, percent)))
      .flatMap(discounted => orders.save(discounted).map(() => discounted))
  );
```

`fromResult` is the join between the two types, lifting a synchronous `Result` into an async chain. An invalid discount means `save` is never reached, and that is a consequence of the types rather than of my remembering to return early. The error channel widens as you compose, so the chain ends up as `AsyncResult<Order, OrderNotFound | InvalidDiscount | PersistenceError>` without anyone writing that union down.

Adapters sit at the edge and are the only code that knows a network exists:

```ts
const httpOrders = (): OrderPort => ({
  findById: id =>
    AsyncResult.fromAsync(() => api.getOrder(id)).mapErr(
      cause => new OrderNotFound(id, { cause })
    ),

  save: order =>
    AsyncResult.fromAsync(() => api.putOrder(order)).mapErr(
      cause => new PersistenceError({ cause })
    ),
});
```

This is where that earlier trade pays for itself. `fromAsync` hands back an `AsyncResult<A, Error>` because it genuinely cannot know what a failed HTTP call means to your domain. The adapter does know, and `mapErr` is where it says so, keeping `cause` so the original is not lost.

Then the same command runs against whichever adapter you give it:

```ts
discountOrder("o-1", 10).provide(httpOrders());

discountOrder("o-1", 10).provide(inMemoryOrders([{ id: "o-1", total: 200 }]));
```

No mocking framework and no module interception. The test double is another implementation of the port, and the thing under test is the same object in both cases.

## Four Things I Got Wrong

The library works. Getting there taught me more than the library itself is worth, so here is the part that might actually be useful to you.

### A Constraint I Never Enforced

Every error type was declared as `E extends Error`. I felt good about that. Then I looked at how the error got there:

```ts
catch (error) {
  return Result.err(error as E);
}
```

JavaScript lets you throw a string. So `E extends Error` was true in the type system and false at runtime, and my whole premise leaked out through a two-word cast. **A constraint you do not enforce at the boundary is a comment.**

The fix normalises anything thrown into a real `Error`, keeping the original as `cause`. The knock-on effect is that these constructors no longer let you name your error type, so you reach for `mapErr` when you want a domain error. I think that trade is correct: the constructor genuinely does not know what you meant to throw, and pretending otherwise is what got me here.

### You Cannot Rate-Limit Work That Already Started

`AsyncResult.all` takes a concurrency cap, which I was quietly proud of. It did not work. Four calls under a cap of two ran four at a time, and I only found out because I wrote a test that counted in-flight requests rather than trusting the option.

The cause is obvious in hindsight. `fromPromise` accepts a `Promise`, and by the time you are holding a promise the work has already started. There is nothing left to delay. No amount of queueing inside the library can un-start it.

This one cannot be fixed, only designed around, which is why the fix is a different constructor that takes the function instead:

```ts
// escapes the cap: fetch is already in flight
AsyncResult.fromPromise(fetch(url));

// respects the cap: nothing runs until `all` says so
AsyncResult.fromAsync(() => fetch(url));
```

**Laziness** stopped looking like a stylistic preference and started looking like the thing that makes the feature possible at all. Both behaviours are now pinned by tests that count concurrency, so the difference cannot quietly rot.

### A Cast In A Test Was Hiding A Bug

`fromNullable` accepted `A | null` but checked `value == null`, so it rejected `undefined` too. The signature and the behaviour disagreed. My test suite was green, and this is the line that kept it green:

```ts
Result.fromNullable(undefined as unknown as null);
```

I wrote that cast to make a test compile. It was the bug reporting itself and I read it as friction. **When a test needs a cast to compile, the cast is usually the finding.**

### Packaging Is Part Of The API

The entry point re-exported helpers with `export * from "./utils"`. The package had no `"type": "module"`, so Node loaded that barrel as CommonJS, and the lexer that detects named exports cannot see through a star re-export. Every helper was unreachable by name from an ESM import. The types were perfect. The import failed.

Sorting that out sent me down a related hole. I went ESM-only, because the one runtime dependency is ESM-only and shipping two copies of a class-based API invites `instanceof` to fail across module graphs. That relies on `require(esm)`, which arrives at Node 20.19 on the 20.x line but not until 22.12 on the 22.x line. So `>=20.19.0` looks like a reasonable floor and quietly admits Node 21 and everything from 22.0 to 22.11, where a CommonJS caller cannot require the package at all. I found that by installing five Node versions and testing each one, which I recommend over reasoning about it.

## What Is Still Missing

**`Computation` does not compose.** It has `create` and `provide` and nothing else, so combining two computations that need different dependencies means nesting them by hand. This is the sharpest edge in the library and the next thing I want to fix, probably with `map` and `flatMap` plus something to widen the dependency type.

Beyond that: there is no `Option`, so absence is still modelled as `null` behind a `Result`. There are no retry or timeout combinators, which is the first thing I reach for in real service code. Errors are `Error` subclasses rather than a discriminated union, so you narrow with `instanceof` instead of switching on a tag, and exhaustiveness checking does not help you.

And `unwrap` throws. It is the one method that leaves the safe world, and every codebase using this will eventually have someone reach for it in the wrong place.

## The Point Where I Give Up On This

I want to be honest about the boundary, because "I wrote my own" ages badly when the scope creeps.

If I find myself needing interruption, resource safety with scoped acquisition and release, fibers, or generator-based do-notation to keep the chains readable, then I am no longer writing a small utility. **I am writing a worse Effect**, and Effect already exists and is maintained by people who think about this full time. Reimplementing it badly is a much worse outcome than paying the learning cost up front.

Until then, the trade is holding. 284 lines of source, 765 lines of tests, and nobody has to learn a new vocabulary to fix a bug. The two things that bothered me have stopped bothering me, and the ceiling is close enough that I will know when I hit it.

The source, the tests and a set of runnable examples are on GitHub at [NikosTsompanides/pragmatic-effects](https://github.com/NikosTsompanides/pragmatic-effects). It is small enough to read in one sitting, which was rather the point.

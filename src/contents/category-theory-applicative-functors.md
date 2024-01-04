---
author: Nikos Tsompanidis
datetime: 2024-01-08T09:00:00Z
title: Introduction to Category Theory - Applicative Functors
slug: introduction-to-category-theory-applicative-functors
featured: true
draft: false
tags:
  - functional programming
  - programming
  - category theory
ogImage: "https://pewylbljypgmyciygfsg.supabase.co/storage/v1/object/public/photos/nikos-tsompanidis-blog-ogImage.webp"
description: Embark on a captivating exploration of Applicative Functors in TypeScript using the powerful fp-ts library. Uncover the magic of functional programming as we delve into currying, the ap operation, and the creation of utility functions for seamless composition. Elevate your coding skills and learn to wield applicative functors to compose effectful programs effortlessly. Join us on this journey through the intricacies of functional programming, where every line of code brings you closer to mastering the art of composability and abstraction.
---

### Unveiling the Power of Applicative Functors in TypeScript with fp-ts

In our previous journey through functional programming, we explored the realm of functors and their transformative capabilities. We discovered how we can seamlessly compose effectful and pure programs using functions like `map`. However, there's a challenge when dealing with functions that accept multiple arguments. Fear not, for we're about to embark on a fascinating adventure into the world of applicative functors.

### Mathematical Definition of the Applicative Functor

In category theory, which provides a mathematical foundation for functional programming, an applicative functor is defined as a [functor](https://nikos-tsompanidis.com/posts/introduction-to-category-theory-functors/) equipped with two additional operations: `pure` and `ap`.

- `pure` takes a value and "lifts" it into the context of the functor. Mathematically, it has the type `pure: (a: A) => F<A>`.
- `ap` (short for apply) is a way to apply a function inside the functor to a value inside the functor. Mathematically, it has the type `ap: (fab: F<(a: A) => B>) => (fa: F<A>) => F<B>`.

The laws that an applicative functor must satisfy are:

1. **Identity Law:** `ap(pure(identity))(v) ≡ v` for any value `v` in the applicative functor.
2. **Homomorphism Law:** `ap(pure(f))(pure(a)) ≡ pure(f(a))` for any pure function `f` and value `a`.
3. **Interchange Law:** `ap(u)(pure(a)) ≡ ap(pure((f: (a: A) => B) => f(a)))(u)` for any applicative functor `u` and value `a`.

These laws ensure that `pure` provides a neutral element, and `ap` behaves in a consistent and sensible manner, allowing for composition and application of functions within the functor. Applicative functors provide a level of abstraction that allows for clean and modular functional programming.

Example:

To make it more relatable, consider a scenario where you have information about a person's age and another piece of information about their height. Using an applicative functor, you can combine these pieces of information to calculate a value that represents the person's body mass index (BMI). The pure action puts each piece of information into the right context, and ap allows you to apply the BMI calculation function to these pieces in a structured manner. So, applicative functors act like a helpful toolkit for managing and combining different types of information in a clear and systematic fashion.

```typescript
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";

// Define a data structure to represent a person
interface Person {
  age: number;
  height: number;
}

// BMI calculation function
const calculateBMI =
  (age: number) =>
  (height: number): number => {
    // A simple BMI formula for illustration purposes
    return Math.round((height / (age * age)) * 10000);
  };

// Lift the BMI calculation function into the Task and Option contexts
const liftedCalculateBMI = T.of(calculateBMI).map(O.of);

// Example: Combining age and height information to calculate BMI
const person: Person = { age: 25, height: 175 };

// Lift the person's age and height into the Option context
const liftedAge = O.of(person.age);
const liftedHeight = O.of(person.height);

// Use the applicative functor to calculate BMI
const resultBMI: O.Option<number> = pipe(
  liftedCalculateBMI,
  T.ap(liftedAge),
  T.ap(liftedHeight)
)();

// Print the result
console.log(resultBMI); // Option<number>
```

### Conclusion: Applicative Functors to the Rescue

As we conclude our thrilling exploration into the power of applicative functors in TypeScript with fp-ts, it's evident that we've unlocked a new dimension of functional programming mastery. Navigating through the intricacies of category theory, we've unveiled the mathematical foundation behind applicative functors—a unique blend of pure and ap operations that elegantly compose functions within the functor.

In this captivating journey, we've witnessed the laws that govern applicative functors, ensuring a harmonious interplay of elements. The practical example, calculating a person's BMI, showcased how applicative functors act as a versatile toolkit, seamlessly combining different pieces of information with clarity and precision.

So, fellow adventurers, armed with the knowledge of applicative functors, let's continue our quest for cleaner, modular, and more expressive code. May your functional programming endeavors be as exhilarating as the world of applicative functors we've uncovered together! 🚀✨

But stay tuned! In the next chapter, we'll explore how applicative functors fit into the larger landscape of functional programming, and we'll unveil an even mightier abstraction: **monads**. The journey continues!

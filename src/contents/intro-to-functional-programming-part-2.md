---
author: Nikos Tsompanidis
datetime: 2023-02-20T18:00:00Z
title: Introduction to Functional Programming (Part 2)
slug: introduction-to-functional-programming-part-2
featured: true
draft: true
tags:
  - functional programming
  - programming
ogImage: "https://pewylbljypgmyciygfsg.supabase.co/storage/v1/object/public/photos/nikos-tsompanidis-blog-ogImage.webp?t=2023-02-15T11%3A15%3A40.300Z"
description: In this blog, we will explain the concepts of immutability, side effects, and functional composition by providing examples using the TypeScript language. Let's have some fun!
---

# Introduction to Functional Programming (Part 2)

Functional programming is a programming paradigm that emphasizes _immutability_, _side effect avoidance_, and _functional composition_ to create software that is easier to reason about, test, and maintain. Immutability ensures that once a data structure is created, it cannot be modified, thus preventing unexpected changes in the program's state. Side effect avoidance minimizes the impact of a function on the overall system state, reducing bugs and making code more predictable. Functional composition enables building more complex behavior from small, composable functions, increasing modularity and reducing coupling between different parts of the code. By embracing these concepts, developers can write more reliable and scalable software. Allow me to elaborate further on the three fundamental concepts of functional programming in the following paragraphs.

## Immutability

In software engineering, an immutable value is a value that cannot be changed once it has been created. Immutable values are used to ensure that the state of an object remains the same throughout its lifetime.

In programming, values that are immutable are often implemented as objects that cannot be modified after they have been created. This means that any attempt to change the value of the object will result in a new object being created with the new value, rather than modifying the original object.

Immutable values have several benefits, including:

1. Thread safety: Since immutable values cannot be modified, they are inherently thread-safe. Multiple threads can access and read the same value without worrying about race conditions or other synchronization issues

2. Predictability: Immutable values are predictable since they cannot be changed once they have been created. This makes it easier to reason about code and reduces the potential for bugs.

3. Performance: Immutable values can be cached and reused, improving performance by reducing the need for costly object creation and garbage collection.

Examples of immutable values in programming include primitive data types such as integers and booleans, as well as objects like strings and tuples that cannot be modified after they are created.

In JavaScript, there are several ways to define immutable values. One way is to use primitive data types such as numbers, strings, and booleans, which are immutable by default. Another way is to use object literals or classes that are designed to be immutable.

Here are some examples:

1. Using const keyword: The const keyword can be used to declare variables with immutable values. Once a variable is assigned a value, it cannot be changed.

```js
const name = "John";

name = "Nikos"; // This will throw: "Uncaught TypeError: Assignment to constant variable."
```

2. Object.freeze():
   The Object.freeze() method can be used to make an **object** immutable. Once an object is frozen, its properties cannot be added, deleted, or modified.

```js
const person = Object.freeze({
  name: "John",
  age: 30,
});
```

In Typescript, in order to define an immutable property inside an object or a tuple you can use the [`readonly` keyword](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#readonly-and-const). Please have in mind that Typescript is a language that compiles to Javascript and the `readonly` does not actually guarantees you that you value will be immutable. Yes, if you'll try to mutate the value of a readonly property the compiler will throw an error but do not take that as granted if you do not use the `Object.freeze` function.

Now that we learn about immutability let's define what a side effect is and learn how to avoid them.

## Side effects

Side effects are considered any changes that are made outside the scope of the function or method being executed, including changes to the state of global variables, modifications to data structures, or interactions with external systems.

Side effects can be intentional or unintentional, and they can have both positive and negative consequences. For example, a function that logs an error message when an exception is thrown has a useful side effect that helps with debugging and troubleshooting. However, a function that modifies global variables without properly encapsulating its state can lead to unintended consequences and difficult-to-debug issues.

There are several types of side effects, including:

1. State modification: Changes to the state of a program or its data structures, such as modifying the values of global variables or updating elements in an array.

2. I/O operations: Interactions with external systems or devices, such as reading from or writing to a file, making a network request, or printing output to the console.

3. Exception throwing: Raising an exception or error that interrupts the normal flow of execution and may have side effects such as logging or altering the program state.

Consider the following code:

```ts
let count: number = 0;
function increment() {
  count++;
}
```

In this code, the increment() function modifies the value of the count variable, which is outside its scope, creating a side effect. To avoid side effects, we can rewrite the code to return a new value instead:

```ts
const count: number = 0;

function increment(currentCount: number) {
  return currentCount + 1;
}

const incrementedCount = increment(count);
```

This approach ensures that our program remains predictable and easier to test.

Writing code without side effects has several advantages:

1. Predictability: Code without side effects is easier to reason about and predict, since its behavior is determined solely by its inputs and outputs. This makes it easier to test and debug.

2. Reusability: Code without side effects is more modular and can be reused more easily, since it doesn't rely on external state or variables.

3. Concurrency: Code without side effects can be safely executed in parallel or distributed environments, since it doesn't rely on shared state or variables.

4. Maintainability: Code without side effects is easier to maintain over time, since it doesn't have hidden or unexpected interactions with other parts of the system.

In functional programming, side effects are typically handled by isolating them into specific sections of the codebase, often called "effectful" functions, and minimizing their impact on the rest of the program.

Here are some common techniques for handling side effects in functional programming:

1. Pure functions: Writing pure functions that don't cause side effects is the easiest way to avoid side effects altogether. Pure functions only rely on their inputs and produce a predictable output, making them easy to reason about and test.

2. Monads: Monads are a design pattern used in functional programming to isolate side effects and encapsulate them in a controlled way. They provide a way to separate the functional, "pure" part of a program from the effectful, "impure" part. We will see defined what a Monad is in other post sto stay tuned!

3. Higher-order functions: Higher-order functions are functions that take other functions as arguments or return functions as their result. They can be used to encapsulate side effects into smaller, more manageable functions.

4. Functional reactive programming (FRP): FRP is a programming paradigm that focuses on handling side effects in a declarative way. It provides a way to model changes over time using streams or observables, and allows side effects to be isolated into specific "sinks" or "reducers".

Now that we defined side-effects and pure functions lets continue with the functional composition

## Functional Composition

Functional composition is a technique used in functional programming to combine multiple functions together to create more complex functionality. It involves taking the output of one function and using it as the input to another function, in a chain or pipeline.

Consider the following example:

```ts
function double(num: number): number {
  return num * 2;
}

function addFive(num: number): number {
  return num + 5;
}

function subtractTwo(num: number): number {
  return num - 2;
}

const doubleAndAddFiveAndSubtractTwo = (num: number) =>
  subtractTwo(addFive(double(num)));

console.log(doubleAndAddFiveAndSubtractTwo(3)); // (((3 * 2) + 5) - 2) Output: 9
```

Here, the `doubleAndAddFiveAndSubtractTwo` function is created by composing the `double`, `addFive` and `subtractTwo` functions together, using the output of `double` as the input to `addFive` and the output of `addFive` as the input to `subtractTwo`. This creates a new function that doubles a given number, then adds 5 and subtracts 2 to the result, in a single step.

Functional composition is a powerful technique that allows us to create complex functionality by combining simpler building blocks, without introducing side effects or modifying external state.

> But this looks a bit complicated? Is this the only way to compose functions in javascript?

#### Fp-ts to the rescue

Fortunately for us, [Giulio Canti](https://github.com/gcanti) has created an excellent library called [fp-ts]('https://github.com/gcanti/fp-ts') which aims to allow developers to use popular patterns and abstractions that are available in most functional languages in Typescript. We will use extensively the fp-ts library in the following posts when we will explain some of the core concepts of the Category Theory. Now lets use the `pipe` function that fp-ts provides us with in order to write a more readable and easy-to-maintain program.

```ts
import { pipe, flow } from "fp-ts/functions";

function double(num: number): number {
  return num * 2;
}

function addFive(num: number): number {
  return num + 5;
}

function subtractTwo(num: number): number {
  return num - 2;
}

// Example of functional composition using `pipe`
console.log(pipe(3, double, addFive, subtractTwo)); // Outputs: 9

// Another example of functional composition using `flow`
const doubleAndAddFiveAndSubtractTwo = flow(double, addFive, subtractTwo);
console.log(doubleAndAddFiveAndSubtractTwo(3)); // Outputs: 9
```

See? It's really fun to apply functional composition using the `pipe` (or `flow`) function.

Unfortunately, Javascript, unlike other Functional Programming languages like `Haskell`, `Scala`, `F#` etc., does not have a `pipe` operator implemented in its core. There is a great [proposal](https://github.com/tc39/proposal-pipeline-operator) for adding a useful pipe operator to JavaScript but still we have a lot of work to do to get there.

### Conclusion

In summary, we have gained an understanding of immutability and its benefits in our code. Additionally, we have learned how to write side-effect-free code through the use of pure functions, and we have also explored the concept of functional composition and its practical application in TypeScript. I hope this has been an enlightening and enjoyable learning experience for you. See you in the next posts.

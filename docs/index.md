---
author: letsmoe
title: An introduction to Gyro
date: April 16, 2022
---

# Gyro

{%
	table_of_contents = toc("Table of Contents");
	sec_grammar = include("./grammar.ebnf");
%}


![Gyroscope with 'GYRO' subscript](./assets/gyro-full-subscript.svg)
<p align="center">
`Gyro` is a high-level, statically typed, compiled programming lanaguage written in pure C (and JavaScript) with the goal of creating an extensible and simplistic environment for use in embedded web applications.
</p>

{{table_of_contents}}

## Syntax
Take a look at the [[syntax/index|syntax]] for more information.

## Principles
`Gyro` has been developed with the idea of a fast and simple language in mind.
It shares a lot of it's syntax with Typescript and old school C. Take a look at
this snippet.

```gyro
float: variable = 5.5;
// We can define comments using double slashes.
int: main = func(...args) {
	// And we call methods by using the `->` arrow syntax.
	int: round = if args->0 > 0 then 1 else 0;

	// We can also use the `return` keyword to return a value.
	return round;
}
```

Since `Gyro` is statically typed, annotations have to be added to help the
compiler figure out the optimal solution for optimizing the given code. `Gyro`
can also be interpreted dynamically, removing the need for type annotations,
they are - however - a best practice for making code more readable and can help
with IDE highlighting.

## Grammar
The full official grammar of `Gyro` is [described here](https://continuum-ai.de/docs/gyro/grammar/).
Here are some important parts of it:

```ebnf
{{sec_grammar}}
```

## Features
There are plenty of programming languages out there that offer flexibility and
immense possibilities for any imaginable situation, why would `Gyro` stand out?
`Gyro` is syntax extensible, meaning you can define your own keywords,
operators, and functions. `Gyro` also offers better string manipulation since it
has been written with writers in mind. There is a high performance markdown and
HTML parser that has been implemented in `Gyro` making it very easy working with
web applications. Remember the `Table of Contents` from above? It has been
automatically generated while compiling. The code for that looks like this:

```gyro
table_of_contents = toc("Table of Contents");
// Notice the `tilde` (~) sign being used as the write operation here.
~table_of_contents;
```

## Reference
For more information take a look at the full [Gyro Reference](https://continuum-ai.de/docs/gyro/reference/).
### Standard Objects
Built-in objects that are supported by the standard library are:
[[`Array`]], [[`Boolean`]],
[[`Date`]], [[`Error`]],
[[`Function`]], [[`Number`]],
[[`Object`]], [[`RegExp`]],
[[`String`]], [[`Symbol`]],
[[`TypeError`]], [[`Undefined`]],
[[`Null`]], [[`Int8Array`]],
[[`Uint8Array`]],
[[`Uint8ClampedArray`]],
[[`Int16Array`]], [[`Uint16Array`]],
[[`Int32Array`]], [[`Uint32Array`]],
[[`Float32Array`]], [[`Float64Array`]],
[[`Map`]], [[`Set`]], [[`WeakMap`]],
[[`WeakSet`]], [[`Promise`]].

### Built-in Libraries
[[`Math`]]
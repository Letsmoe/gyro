---
title: Syntax - Gyro
---

# Syntax
This page lays out detailed information about the syntax, reserved keywords and general design considerations.

{%
	table = toc("Table of Contents");
%}
{{table}}

## Keywords


|Keyword | Description | Example |
|---------|----------|--------- |
| func | Declares the beginning of a new function. | [func](#func) |
| import | Used to import the contents of another Gyro script. | [import](#import) |
| export | Used to export contents of the current script for use in another | [export](#export) |
| for | Used to iterate over a given value. | [for](#for) |

### Func
Used to declare the beginning of a new function, must be followed by a list of arguments and a function body.
The body of a function may be a single statement, or a block of statements, it may contain a return statement, the type of the return value is void if not declared otherwise.

```gyro
	any: example = func(a,b) {
		# Used to add two values together.
		a + b;
	}
```

### Import
Used to import the contents of another Gyro script. Is being used with the [from](#from) keyword to specify only some parts of the external scope to be included into the current document and made available to the current execution scope.
The path of an import must be relative to the current document or start with `@` where it points to the current directories [modules](/modules/index.html) directory.

```gyro
	# Only import `add` and `subtract` from the external script.
	import add, subtract from "example.gyro";

	# Import everything from the example script.
	import * from "example.gyro";
```

### Export
Used to expose some parts of the current script to be made available to an includer - meaning a script that may import parts of the script.


```gyro
	(any: add) = func(a, b) {
		return a + b;
	}

	(any: subtract) = func(a, b) {
		return a - b;
	}

	# Export only one of the two defined functions.
	export add, subtract;

	# Export everything in the current scope.
	export *;
```

### For
Used to declare an iteration over a given value. The value can be of type [[`string`]], [[`number`]], [[`Array`]], [[`Map`]] or [[`Set`]].

The control variable always has type [[`auto`]] but may be specified otherwise if performance is key.

```gyro
	for (int: i) in [1,2,3] {
		# Do something with the value.
		print(i);
	} # => 1, 2, 3

	for (int: i = 0); i < 3; i++ then print(i); # => 0, 1, 2
```

### If

## Operators

## Design Considerations

## Object-oriented Design

## Syntax Extension
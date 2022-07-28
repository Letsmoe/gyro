---
title: if/else - Gyro
author: letsmoe
---

# if/else

Conditionals are a basic part of every programming language. Branches in Gyro have to be surrounded by parentheses, like in Python the `else if` branch is declared as `elif`.

```gyro
const main = func() {
	var n = 42;

	if (n < 0) {
		printf("%s is negative", n);
	} elif (n > 0) {
		printf("%s is positive", n);
	} else {
		printf("%s is zero", n);
	}

	return n;
}
```

There is an available short form of `if/else` called the [[Ternary]] operator, it is specified in two versions, a `Symboled Ternary` and a `Written Ternary`.

```gyro
var n = (10 if (5 > 4) else 8);
```
Written Ternary

```gyro
var n = (5 > 4) ? 10 : 8;
```
Symboled Ternary
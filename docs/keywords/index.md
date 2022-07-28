---
title: Keywords - Gyro
author: letsmoe
---

# Keywords

## Static Keywords


### [[struct]]
The struct keyword is used to define new data structures that are auto instantiable when assigned to a [[variable]] or [[constant]].

```gyro
struct Vector3D {
	x: float | int;
	y: float | int;
	z: float | int;
}

const newVector: Vector3D = { 4, 2, 1 };
```

### [[type]]
The type keyword allows for simplifying type annotations by defining them beforehand.

```
type Matrix2x2 = Array<Array<float | int>(2)>(2);

const matrix: Matrix2x2 = [ [ 42, 2.78 ], [ 3.14, 4 ] ]

```

## Weak Keywords
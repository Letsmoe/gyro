---
title: Dialects
author: letsmoe
---

# Dialects

```gyro
extend syntax by Ternary {
	[(condition: any)] ? [(is_true: any)] : [(is_false: any)]
} implements {
	if (condition) {
		return is_true;
	}
	return is_false;
}
```
The extend keyword allows users to build upon the base of a model/view, this includes the built-in "syntax" type, meaning that users can define custom behaviour for different parts of the system.
In the first example you can see the implementation of the ever-so-popular ternary operator.
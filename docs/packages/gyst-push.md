---
title: Push - Gyst
author: letsmoe
---

# Gyst Push

## Synopsis

```
gyst push [<package-name>] ...

aliases: install, i, add
```

## Description

The push command adds a new package to the dependencies list, installs it including all of its dependencies.

## Configuration

### save

```
gyst push @continuum/math --save
```

The optional parameter `--save` will cause the installed package to be wrriten into the dependencies list, this can be applied e.g. to symlinks which would normally not be saved as a global dependency.

### save-dev


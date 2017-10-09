# Generate Doxygen Comments for VS Code

This VS Code Extensions provides Doxygen Documentation generation on the fly by starting a Doxygen comment block and pressing enter.

[![Build Status](https://travis-ci.org/christophschlosser/doxdocgen.svg?branch=master)](https://travis-ci.org/christophschlosser/doxdocgen)
[![Build status](https://ci.appveyor.com/api/projects/status/4h84071p9tv0y9r6?svg=true)](https://ci.appveyor.com/project/christophschlosser/doxdocgen)

## Features

Generate Doxygen Comments from method signatures.

From simple setter methods

![Simple Parameter](images/param_simple.gif)

over declarations

![Declaration](images/declaration.gif)

to bool return values.

![Bool return val](images/bool.gif)

And some special cases:

Like Constructors

![Constructor](images/ctor.gif)

Defintions in header files

![definition](images/definition.gif)

Multi line definitions/declarations

![method](images/method.gif)

Or void return values

![void](images/void.gif)

## Extension Settings

See [Below](#whats-to-come)

## Known Issues

Completely new extension, so none.

## What's to come

* Suggest smart text

* Configuration options

* Tests

* More languages
  * C++11 and newer

* Improve language support
  * Classes
  * Namespaces
  * Enums

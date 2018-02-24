# Generate Doxygen Comments for VS Code

This VS Code Extensions provides Doxygen Documentation generation on the fly by starting a Doxygen comment block and pressing enter.

[![Build Status](https://travis-ci.org/christophschlosser/doxdocgen.svg?branch=master)](https://travis-ci.org/christophschlosser/doxdocgen)
[![Build status](https://ci.appveyor.com/api/projects/status/4h84071p9tv0y9r6?svg=true)](https://ci.appveyor.com/project/christophschlosser/doxdocgen)
[![codecov](https://codecov.io/gh/christophschlosser/doxdocgen/branch/master/graph/badge.svg)](https://codecov.io/gh/christophschlosser/doxdocgen)

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

Multi line definitions/declarations

![method](images/method.gif)

Strip reserved keywords

![keywords](images/keywords.gif)

Or even function pointers

![func_ptr](images/function_ptr.gif)

Featuring an extensive generation customization system

![options](images/options.gif)
![xml options](images/opts-xml.gif)

Generate documentation for the file you just created

![file description](images/file.gif)

## Extension Settings

See [Below](#whats-to-come)

## Contributors

[Christoph Schlosser](https://github.com/christophschlosser)

[Rowan Goemans](https://github.com/rowanG077)

## Known Issues

[See open bugs](https://github.com/christophschlosser/doxdocgen/labels/bug)

## What's to come

* Suggest smart text

* Configuration options
  * Support more configuration options

* More languages

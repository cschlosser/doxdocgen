# Generate Doxygen Comments for VS Code

This VS Code Extensions provides Doxygen Documentation generation on the fly by starting a Doxygen comment block and pressing enter.

[![Build Status](https://travis-ci.org/christophschlosser/doxdocgen.svg?branch=master)](https://travis-ci.org/christophschlosser/doxdocgen)
[![Build status](https://ci.appveyor.com/api/projects/status/4h84071p9tv0y9r6?svg=true)](https://ci.appveyor.com/project/christophschlosser/doxdocgen)
[![codecov](https://codecov.io/gh/christophschlosser/doxdocgen/branch/master/graph/badge.svg)](https://codecov.io/gh/christophschlosser/doxdocgen)
[![Gitter chat](https://badges.gitter.im/doxdocgen.png)](https://gitter.im/doxdocgen)

## Table of Contents

* [Features](#features)
  * [Attributes](#attributes)
  * [Con- and Destructors](#con--and-destructors)
  * [Extensive customization](#extensive-customization)
  * [File descriptions](#file-descriptions)
  * [Function pointers](#function-pointers)
  * [Operators](#operators)
  * [Parameters](#parameters)
  * [Return types](#return-types)
    * [Trailing](#trailing)
  * [Smart text](#smart-text)
  * [Templates](#templates)
* [Config options](#config-options)
* [Contributors](#contributors)
* [Known Issues](#known-issues)
* [What's to come](#whats-to-come)

## Features

### Attributes

![Attribute](images/attributes.gif)

### Con- and Destructors

![Constructor](images/ctor.gif)
![Destructor](images/dtor.gif)

### Extensive customization

![options](images/options.gif)
![xml options](images/opts-xml.gif)

### File descriptions

![file description](images/file.gif)

### Function pointers

![func_ptr](images/function_ptr.gif)

### Operators

![Operator](images/operator.gif)
![Delete Operator](images/op-delete.gif)

### Parameters

![Simple Parameter](images/param_simple.gif)
![Long Parameter](images/long-param.gif)

### Return types

![Bool return val](images/bool.gif)
![Declaration](images/declaration.gif)

### Smart text

![Smart text CTor](images/smartTextCtor.gif)
![Smart text Custom](images/smartTextCustom.gif)
![Smart text Getter](images/smartTextGet.gif)

Supported smart text snippets:

* Constructors

* Destructors

* Getters

* Setters

* Factory methods

Each of them can be configured with its own custom text and you can decide if the addon should attempt to split the name of the method according to its case.

#### Trailing

![Trailing return](images/trailing.gif)

### Templates

![Template method](images/template.gif)
![Template class](images/template-class.gif)

## Config options

```json
// The prefix that is used for each comment line.
"doxdocgen.c.commentPrefix": " * ",

// Smart text snippet for factory methods/functions.
"doxdocgen.c.factoryMethodText": "Create a {name} object",

// The first line of the comment that gets generated. If empty it won't get generated at all.
"doxdocgen.c.firstLine": "/**",

// Smart text snippet for getters.
"doxdocgen.c.getterText": "Get the {name} object",

// The last line of the comment that gets generated. If empty it won't get generated at all.
"doxdocgen.c.lastLine": " */",

// Smart text snippet for setters.
"doxdocgen.c.setterText": "Set the {name} object",

// Doxygen comment trigger. This character sequence triggers generation of DoxyGen comments.
"doxdocgen.c.triggerSequence": "/**",

// Smart text snippet for constructors.
"doxdocgen.cpp.ctorText": "Construct a new {name} object",

// Smart text snippet for destructors.
"doxdocgen.cpp.dtorText": "Destroy the {name} object",

// Whether to insert a newline after the template params.
"doxdocgen.cpp.newLineAfterTParams": false,

// The template of the template parameter DoxyGen line(s) that are generated. If empty it won't get generated at all.
"doxdocgen.cpp.tparamTemplate": "@tparam {param} ",

// The order to use for the date. Valid values are shown in default setting.
"doxdocgen.file.fileOrder": [
  "brief",
  "file",
  "author",
  "date"
],

// The template for the file parameter in DoxyGen.
"doxdocgen.file.fileTemplate": "@file {name}",

// Set the style of the author tag and your name.
"doxdocgen.generic.authorTag": "@author your name",

// If this is enabled a bool return value will be split into true and false return param.
"doxdocgen.generic.boolReturnsTrueFalse": true,

// The template of the brief DoxyGen line that is generated. If empty it won't get generated at all.
"doxdocgen.generic.briefTemplate": "@brief ",

// The format to use for the date.
"doxdocgen.generic.dateFormat": "YYYY-MM-DD",

// The template for the date parameter in DoxyGen.
"doxdocgen.generic.dateTemplate": "@date {date}",

// Decide if you want to get smart text for certain commands.
"doxdocgen.generic.generateSmartText": true,

// Whether include type information at return.
"doxdocgen.generic.includeTypeAtReturn": true,

// How many lines the plugin should look for to find the end of the declaration. Please be aware that setting this value too low may improve the speed of comment generation but the plugin also may not correctly detect all declarations or definitions anymore.
"doxdocgen.generic.linesToGet": 20,

// Whether to insert a newline after a brief.
"doxdocgen.generic.newLineAfterBrief": true,

// Whether to insert a newline after the params.
"doxdocgen.generic.newLineAfterParams": false,

// The template of the param DoxyGen line(s) that are generated. If empty it won't get generated at all.
"doxdocgen.generic.paramTemplate": "@param {param} ",

// The template of the return DoxyGen line that is generated. If empty it won't get generated at all.
"doxdocgen.generic.returnTemplate": "@return {type} ",

// Decide if the values put into {name} should be split according to their casing.
"doxdocgen.generic.splitCasingSmartText": true
```

## Contributors

[Christoph Schlosser](https://github.com/christophschlosser)

[Rowan Goemans](https://github.com/rowanG077)

## Known Issues

[See open bugs](https://github.com/christophschlosser/doxdocgen/labels/bug)

## What's to come

[See open features](https://github.com/christophschlosser/doxdocgen/labels/enhancement)

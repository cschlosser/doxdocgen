# Change Log

## [0.6.0]

### Feature

- Add support for multiline template #140 (#127)
  
  Thanks to @eternalphane

- Enable CUDA language support #148 (#128)
  
  Thanks to @trxcllnt

### Other

- Update dev dependencies

## [0.5.2]

### Fix

- Cannot see params & return value, for global functions (#136)

## [0.5.1]

### Fix

- ignore "restrict" keyword in C function parameter pointer (#121)

- Parameters not generated when using custom trigger (#119)

- Function argument. Pointer to table is not generated. (#123)

### Other

- Update dev dependencies and increase min VS Code version (#131, #132)

## [0.5.0]

### Feature

- Feature suggest: Indent option (#107)

#### Alignment

This version introduces the possibility to align text elements in config strings at a specified width.

Example:

```json
"doxdocgen.generic.paramTemplate": "@param{indent:10}{param}{indent:30}My Param doc"
```

will turn into

```cpp
/**
 * @param    foo                 My Param doc
 * @param    barIsAlsoAnOption   My Param doc
 */
void bar(int foo, int barIsAlsoAnOption);
```

You can use the `{indent:<number>}` in any templated config option available. Numbers have to be bigger than 0 to have any effect.

Alignment will be done from the start of the config string, like this:

```json
"doxdocgen.generic.paramTemplate": "@param {param}{indent:14}test"
```

```cpp
/**
 * @param        test
 */ 
   |<---------->| // 14
```

## [0.4.3]

### Fix

- Trigger Sequence /** causes extra */ to be generated and the comment block isn't fully generated. (#111)

## [0.4.2]

### Fix

- Invalid argument name for C enum types (#102)

## [0.4.1]

### Fix

- Wrong \param value generation. (#91)

## [0.4.0]

### Feature

- Additional file header fields for version, copyright, and custom text (#89)

## [0.3.3]

### Fix

- Doesn't parse cpp member pointer names correctly (#78)

## [0.3.2]

### Fix

- Cannot read property 'text' of undefined (#79)

## [0.3.1]

### Fix

- Don't create a comment while editing an existing comment. (#67)

## [0.3.0]

### Features

- Custom doxygen tag order for methods (#55)

- Suggest smart text (#57)

  For more details see [README.md](https://github.com/christophschlosser/doxdocgen/tree/0.3.0#smart-text)

- Config keys are now grouped, see [Config update](#config-update) for changes

### Config update

| Old value                             | New value                              | Change   |
|---------------------------------------|----------------------------------------|:--------:|
| doxdocgen.generic.triggerSequence     | doxdocgen.c.triggerSequence            | Category |
| doxdocgen.generic.firstLine           | doxdocgen.c.firstLine                  | Category |
| doxdocgen.generic.commentPrefix       | doxdocgen.c.commentPrefix              | Category |
| doxdocgen.generic.lastLine            | doxdocgen.c.lastLine                   | Category |
|                                       | doxdocgen.c.setterText                 | Added    |
|                                       | doxdocgen.c.getterText                 | Added    |
|                                       | doxdocgen.c.factoryMethodText          | Added    |
| doxdocgen.generic.newLineAfterTParams |                                        | Removed  |
| doxdocgen.generic.newLineAfterBrief   |                                        | Removed  |
| doxdocgen.generic.newLineAfterParams  |                                        | Removed  |
| doxdocgen.generic.tparamTemplate      | doxdocgen.cpp.tparamTemplate           | Category |
|                                       | doxdocgen.cpp.ctorText                 | Added    |
|                                       | doxdocgen.cpp.dtorText                 | Added    |
| doxdocgen.generic.fileTemplate        | doxdocgen.file.fileTemplate            | Category |
| doxdocgen.generic.fileOrder           | doxdocgen.file.fileOrder               | Category |
|                                       | doxdocgen.generic.generateSmartText    | Added    |
|                                       | doxdocgen.generic.splitCasingSmartText | Added    |
|                                       | doxdocgen.generic.order                | Added    |

## [0.2.1]

- Hotfix. Include moment.js as runtime dependency

## [0.2.0]

- Fix #51

- Fix #52

## [0.1.0]

- Fix #40

- Fix #38

- Fix #37

- Fix #36

- Fix #28

- Fix #24

- Implemented support for noexcept and throw

- Implemented support for constexpr and final

- Implemented support for unnamed parameters, this broke in version 0.0.7

- Add new config variable that allows a user to disable the true and false return on bool types and make it behave like a normal type

## [0.0.7]

- Fix #31

- Fixed bug where using a different trigger sequence then "*" causes a newline to be addd between the comment and the documented entity.

## [0.0.6]

- Improve and fix comment generation for several C++ features (#23) (thanks to @rowanG077 again)

## [0.0.5]

- Extend customization of generated documentation (#15, #16) (thanks to @rowanG077)

- Fix #10

## [0.0.4]

- Fix #9

- Add option to choose if the return type should be included in generated documentation

## [0.0.3]

- Add possibility to set comment start indicator to Qt style

## [0.0.2]

- Add C parser and generator

## [0.0.1]

- Initial release

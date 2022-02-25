# Change Log

## [1.4.0]

### Feature

- Use `vscode.workspace.workspaceFolders[0]` to construct SimpleGit instance (#268)
  Thanks to @lukester1975

### Fix

- Add official VS Code Language identifier for CUDA (#273)
  Thanks to @jobtijhuis

## [1.3.2]

### Fix

- Indent alignment not working in file comments (#206) (#236)
  Thanks to @HO-COOH

- Several typos (#233)
  Thanks to @jogo-

## [1.3.1]

### Fix

- Only suggest Doxygen snippet's when the cursor is in a comment section (#224) (#229)
  Thanks to @HO-COOH

## [1.3.0]

### Feature

- Add `{file}` template, so it can be used in custom tag of both file comments and generic comments (#191) (#221)
  Thanks to @HO-COOH

## [1.2.2]

### Fix

- Fix tags in generic order not expanded (#204) (#217)
  Thanks to @HO-COOH

## [1.2.1]

### Fix

- Fix unexpected return tag on non-functions (#210) (#214)
  Thanks to @HO-COOH

## [1.2.0]

### Feature

- Doxygen command Intellisense support (#211)
  Thanks to @HO-COOH

### Other

- Nicer setting descriptions (#209)
  Thanks to @HO-COOH

## [1.1.0]

### Feature

- Substitute author and email by git config (#186) (#182)
  Thanks to @to-s

### Other

- Update to Typescript 3.8.3

## [1.0.1]

### Fix

- Files without includes don't trigger the autocomplete for file description (#141) (#183)
  Thanks to @to-s

## [1.0.0]

### Revert

- Revert reverting Replace environment variables in templated strings. If no environment variable can be found the name of the variable will be inserted (#110)

### Other

- vsce packaging is forcing yarn even if no yarn config exists. Override this behavior now to use npm.

## [0.8.2]

### Other

- Package with older version of vsce

## [0.8.1]

### Revert

- Replace environment variables in templated strings. If no environment variable can be found the name of the variable will be inserted (#110)

## [0.8.0]

### Feature

- Support for arbitrary tags (#169)

- Replace environment variables in templated strings. If no environment variable can be found the name of the variable will be inserted (#110)

### Fix

- Incorrect parameter name of template (#170)

## [0.7.2]

### Fix

- Could not generate correct file header annotation (again) #164 (#161)

## [0.7.1]

### Fix

- Could not generate correct file header annotation #162 (#161)

## [0.7.0]

### Feature

- Add option to filter keywords (like custom defines) from input line #159 (#152)

### Fix

- Argument type would be placed as the param instead of the argument name #154

  Thanks to @DaanHuinink

- Bug when commenting macros #158 (#142)

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

- Ignore `restrict` keyword in C function parameter pointer (#121)

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

- Invalid argument name for C `enum` types (#102)

## [0.4.1]

### Fix

- Wrong \param value generation. (#91)

## [0.4.0]

### Feature

- Additional file header fields for version, copyright, and custom text (#89)

## [0.3.3]

### Fix

- Doesn't parse CPP member pointer names correctly (#78)

## [0.3.2]

### Fix

- Cannot read property 'text' of undefined (#79)

## [0.3.1]

### Fix

- Don't create a comment while editing an existing comment. (#67)

## [0.3.0]

### Features

- Custom Doxygen tag order for methods (#55)

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

- Implemented support for `noexcept` and `throw`

- Implemented support for `constexpr` and `final`

- Implemented support for unnamed parameters, this broke in version 0.0.7

- Add new config variable that allows a user to disable the true and false return on bool types and make it behave like a normal type

## [0.0.7]

- Fix #31

- Fixed bug where using a different trigger sequence than "*" causes a newline to be added between the comment and the documented entity.

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

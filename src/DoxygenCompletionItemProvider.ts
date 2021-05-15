import * as vscode from "vscode";
import { inComment } from "./util";

// tslint:disable:max-line-length

/*https://github.com/cschlosser/doxdocgen/issues/30 */
export default class DoxygenCompletionItemProvider implements vscode.CompletionItemProvider {
    /**
     * commands are a tuple of <command, snippet, documentation>
     */
    public static readonly commands: Array<[string, string, string]> = [
        /*Special commands */
        ["a", "${1:word}", "Display `<word>` in italics"],
        ["arg", "${1:item-description}", "Generate a simple, non-nested list of arguments"],
        ["b", "${1:word}", "Display `<word>` in bold"],
        ["c", "${1:word}", "Dispaly `<word>` using a typewriter font"],
        ["code", ".${1:language-id}\n${2:code}\n@endcode", "Starts a block of code"], // TODO: match end block symbol with trigger character
        ["copydoc", "${1:link-object}", "Copy a documentation block from the object specified by `<link-object>` and paste it at the location of the command. The link object can point to a member (of a class, file or group), a class, a namespace, a group, a page, or a file. If the memeber if overloaded, you should specify the argument types explicitly"],
        ["copybrief", "${1:link-object}", "Work in a similar way as `@copydoc` but will only copy the brief description, not the detailed documentation"],
        ["copydetails", "${1:link-object}", "Work in a similar way as `@copydoc` but will only copy the detailed documentation, not the brief description"],
        ["docbookonly", "$1\n@enddocbookonly", "Start a block of text that only will be verbatim included in the generated DocBook documentation and tagged with `<docbookonly>` in the generated XML output"],
        ["emoji", ":${1:name}:", "Produce an emoji character given its name"],
        ["startuml", "${1:file} \"${2:caption}\" ${3:size_indication}=${4:size}\n@enduml", "Start a text fragment which should contain a valid description of a PlantUML diagram"],
        ["e", "${1:word}", "Display `<word>` in italics"],
        ["em", "${1:word}", "Display `<word>` in italics"],
        ["endcode", "", "End a block of code"],
        ["enddocbookonly", "", "End a block of text that was started with `@docbookonly` command"],
        ["enduml", "", "End a block that was started with `@startuml`"],
        ["endhtmlonly", "", "End a block of text that was started with a `@htmlonly` command"],
        ["endlatexonly", "", "End a block of text that was started with a `@latexonly` command"],
        ["endmanonly", "", "End a block of text that was started with a `@manonly` command"],
        ["endxmlonly", "", "End a block of text that was started with a `@xmlonly` command"],
        ["htmlonly", "$1\n@endhtmlonly", "Start a block of text that only will be verbatim included in the generated HTML documentation and tagged with `<htmlonly>` in the generated XML output"],
        ["image", "${1|html,latex,docbook,rtf|} ${2:file} ${3:caption} ${4:${5:size_inidication}=${6:size}}", "Insert an image into the documentation"],
        ["latexonly", "$1\n@endlatexonly", "Start a block of text that only will be verbatim included in the generated LATEX documentation and tagged with `<latexonly>` in the generated XML output"],
        ["manonly", "$1\n@manonly", "Start a block of text that only will be verbatim included in the generated MAN documentation and tagged with `<manonly>` in the generated XML output"],
        ["li", "${1:item-description}", "Generate a simple, non-nested list of arguments"],
        ["n", "", "Force a new line"],
        ["verbatim", "$1\n@verbatim", "Start a block of text that will be verbatim included in the documentation"],
        ["xmlonly", "$1\n@endxmlonly", "Start a block of text that will be verbatim included in the documentation"],
        /*Section indicators */
        ["attention", "${1:attention text}", "Start a paragraph where a message that needs attention may be entered. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@attention` commands will be joined into a single paragraph. The `@attention` command ends when a blank line or some other sectioning command is encountered."],
        ["author", "${1:author}", "Starts a paragraph where one or more author names may be entered. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@author` commands will be joined into a single paragraph. Each author description will start a new line. Alternatively, one `@author` command may mention several authors. The `@author` command ends when a blank line or some other sectioning command is encountered."],
        ["authors", "${1:list of authors}", "Equivalent to `@author`"],
        ["brief", "${1:brief description}", "Starts a paragraph that serves as a brief description. For classes and files the brief description will be used in lists and at the start of the documentation page. For class and file members, the brief description will be placed at the declaration of the member and prepended to the detailed description. A brief description may span several lines (although it is advised to keep it brief!). A brief description ends when a blank line or another sectioning command is encountered. If multiple `@brief` commands are present they will be joined."],
        ["bug", "${1:bug description}", "Starts a paragraph where one or more bugs may be reported. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@bug` commands will be joined into a single paragraph. Each bug description will start on a new line. Alternatively, one `@bug` command may mention several bugs. The `@bug` command ends when a blank line or some other sectioning command is encountered."],
        ["cond", "${1:section label}", "Starts a conditional section that ends with a corresponding `@endcond` command, which is typically found in another comment block"],
        ["copyright", "${1:copyright description}", "Starts a paragraph where the copyright of an entity can be described. This paragraph will be indented."],
        ["date", "${1:date description}", "Starts a paragraph where one or more dates may be entered. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@date` commands will be joined into a single paragraph. Each date description will start on a new line. Alternatively, one `@date` command may mention several dates. The `@date` command ends when a blank line or some other sectioning command is encountered."],
        ["deprecated", "${1:description}", "Starts a paragraph indicating that this documentation block belongs to a deprecated entity"],
        ["details", "${1:description}", "Just like `@brief` starts a brief description, `@details` starts the detailed description. You can also start a new paragraph (blank line) then the `@details` command is not needed."],
        ["noop", "", "All the text, including the command, till the end of the line is ignored"],
        ["else", "", "Starts a conditional section if the previous conditional section was not enabled. The previous section should have been started with a `@if`, `@ifnot`, or `@elseif` command."],
        ["elseif", "${1:section-label}", "Starts a conditional documentation section if the previous section was not enabled. A conditional section is disabled by default. To enable it you must put the section-label after the ENABLED_SECTIONS tag in the configuration file. The section label can be a logical expression build of section names, round brackets, && (AND), || (OR) and ! (NOT). Conditional blocks can be nested. A nested section is only enabled if all enclosing sections are enabled as well."],
        ["endcond", "", "Ends a conditional section that was started by `@cond`."],
        ["endif", "", "Ends a conditional section that was started by `@if` or `@ifnot` For each `@if` or `@ifnot` one and only one matching `@endif` must follow."],
        ["exception", "${1:exception-object} ${2:exception description}", "Starts an exception description for an exception object with name `<exception-object>`. Followed by a description of the exception. The existence of the exception object is not checked. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent @exception commands will be joined into a single paragraph. Each exception description will start on a new line. The `@exception` description ends when a blank line or some other sectioning command is encountered"],
        ["if", "${1:section-label}\n$2\n@endif", "Starts a conditional documentation section. The section ends with a matching `@endif` command. A conditional section is disabled by default. To enable it you must put the section-label after the ENABLED_SECTIONS tag in the configuration file.The section label can be a logical expression build of section names, round brackets, && (AND), || (OR) and!(NOT).If you use an expression you need to wrap it in round brackets, i.e `@cond(!LABEL1 && LABEL2)`."],
        ["ifnot", "${1:section-label}", "Starts a conditional documentation section. The section ends with a matching `@endif` command. This conditional section is enabled by default. To disable it you must put the section-label after the ENABLED_SECTIONS tag in the configuration file. The section label can be a logical expression build of section names, round brackets, && (AND), || (OR) and ! (NOT)."],
        ["invariant", "${1:description of invariant}", "Starts a paragraph where the invariant of an entity can be described. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@invariant` commands will be joined into a single paragraph. Each invariant description will start on a new line. Alternatively, one `@invariant` command may mention several invariants. The `@invariant` command ends when a blank line or some other sectioning command is encountered."],
        ["note", "${1:text}", "Starts a paragraph where a note can be entered. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@note` commands will be joined into a single paragraph. Each note description will start on a new line. Alternatively, one `@note` command may mention several notes. The `@note` command ends when a blank line or some other sectioning command is encountered"],
        ["par", "${1:paragraph title}\n$2", "If a paragraph title is given this command starts a paragraph with a user defined heading. The heading extends until the end of the line. The paragraph following the command will be indented. If no paragraph title is given this command will start a new paragraph. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. The `@par` command ends when a blank line or some other sectioning command is encountered."],
        ["param", "${1:parameter-name} ${2:description}", "Starts a parameter description for a function parameter with name `<parameter-name>`, followed by a description of the parameter. The existence of the parameter is checked and a warning is given if the documentation of this (or any other) parameter is missing or not present in the function declaration or definition. Multiple adjacent `@param` commands will be joined into a single paragraph. Each parameter description will start on a new line. The `@param` description ends when a blank line or some other sectioning command is encountered. Note that you can also document multiple parameters with a single `@param` command using a comma separated list."],
        ["parblock", "\n$1\n@endparblock", "For commands that expect a single paragraph as argument (such as `@par`, `@param` and `@warning`), the `@parblock` command allows to start a description that covers multiple paragraphs, which then ends with `@endparblock`."],
        ["endparblock", "", "This ends a block of paragraphs started with `@parblock`."],
        ["tparam", "${1:template-parameter-name} ${2:description}", "Starts a template parameter for a class or function template parameter with name `<template-parameter-name>`, followed by a description of the template parameter."],
        ["post", "${1:description of the postcondition}", "Starts a paragraph where the postcondition of an entity can be described. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@post` commands will be joined into a single paragraph. Each postcondition will start on a new line. Alternatively, one `@post` command may mention several postconditions. The `@post` command ends when a blank line or some other sectioning command is encountered."],
        ["pre", "${1:description of the precondition}", "Starts a paragraph where the precondition of an entity can be described. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@pre` commands will be joined into a single paragraph. Each precondition will start on a new line. Alternatively, one `@pre` command may mention several preconditions. The `@pre` command ends when a blank line or some other sectioning command is encountered."],
        ["remark", "${1:remark text}", "Starts a paragraph where one or more remarks may be entered. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@remark` commands will be joined into a single paragraph. Each remark will start on a new line. Alternatively, one `@remark` command may mention several remarks. The `@remark` command ends when a blank line or some other sectioning command is encountered."],
        ["remarks", "${1:remark text}", "Equivalent to `@remark`"],
        ["result", "${1:description of the result value}", "Equivalent to `@return`"],
        ["return", "${1:description of the return value}", "Starts a return value description for a function. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@return` commands will be joined into a single paragraph. The `@return` description ends when a blank line or some other sectioning command is encountered"],
        ["returns", "${1:description of the return value}", "Equivalent to `@return`"],
        ["retval", "${1:return value} ${2:description}", "Starts a description for a function's return value with name `<return value>`, followed by a description of the return value. The text of the paragraph that forms the description has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@retval` commands will be joined into a single paragraph. Each return value description will start on a new line. The `@retval` description ends when a blank line or some other sectioning command is encountered."],
        ["sa", "${1:reference}", "Starts a paragraph where one or more cross-references to classes, functions, methods, variables, files or URL may be specified. Two names joined by either `::` or `#` are understood as referring to a class and one of its members. One of several overloaded methods or constructors may be selected by including a parenthesized list of argument types after the method name."],
        ["see", "${1:reference}", "Equivalent to `@sa`"],
        ["short", "${1:short description", "Equivalent to `@brief`"],
        ["since", "${1:text}", "This command can be used to specify since when (version or time) an entity is available. The paragraph that follows `@since` does not have any special internal structure. All visual enhancement commands may be used inside the paragraph. The `@since` description ends when a blank line or some other sectioning command is encountered."],
        ["test", "${1:paragraph describing a test case", "This command can be used to specify since when (version or time) an entity is available. The paragraph that follows `@since` does not have any special internal structure. All visual enhancement commands may be used inside the paragraph. The `@since` description ends when a blank line or some other sectioning command is encountered."],
        ["throw", "${1:exception-object} ${2:exception description}", "Equivalent to `@exception`"],
        ["throws", "${1:exception-object} ${2:exception description}", "Equivalent to `@exception`"],
        ["todo", "${1:paragraph describing what is to be done}", "Starts a paragraph where a `TODO` item is described. The description will also add an item to a separate `TODO` list. The two instances of the description will be cross-referenced. Each item in the `TODO` list will be preceded by a header that indicates the origin of the item."],
        ["version", "${1:version number}", "Starts a paragraph where one or more version strings may be entered. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@version` commands will be joined into a single paragraph. Each version description will start on a new line. Alternatively, one `@version` command may mention several version strings. The `@version` command ends when a blank line or some other sectioning command is encountered."],
        ["warning", "${1:warning message}", "Starts a paragraph where one or more warning messages may be entered. The paragraph will be indented. The text of the paragraph has no special internal structure. All visual enhancement commands may be used inside the paragraph. Multiple adjacent `@warning` commands will be joined into a single paragraph. Each warning description will start on a new line. Alternatively, one `@warning` command may mention several warnings. The `@warning` command ends when a blank line or some other sectioning command is encountered."],
        ["xrefitem", "${1:key} \"${2:heading}\" \"${3:list title}\" ${4:text}", "This command is a generalization of commands such as `@todo` and `@bug`. It can be used to create user-defined text sections which are automatically cross-referenced between the place of occurrence and a related page, which will be generated. On the related page all sections of the same type will be collected."],
        /*Commands to create links */
        ["addindex", "${1:text}", "This command adds `text` to the LATEX, DocBook and RTF index."],
        ["anchor", "${1:word}", "This command places an invisible, named anchor into the documentation to which you can refer with the `@ref` command."],
        ["cite", "${1:label}", "Adds a bibliographic reference in the text and in the list of bibliographic references. The `<label>` must be a valid BibTeX label that can be found in one of the `.bib` files listed in `CITE_BIB_FILES`. For the LATEX output the formatting of the reference in the text can be configured with `LATEX_BIB_STYLE`. For other output formats a fixed representation is used. Note that using this command requires the bibtex tool to be present in the search path."],
        ["endlink", "", "This command ends a link that is started with the `@link` command."],
        ["link", "${1:link-object} @endlink", "The links that are automatically generated by doxygen always have the name of the object they point to as link-text.The `@link` command can be used to create a link to an object (a file, class, or member) with a user specified link-text. The link command should end with an `@endlink` command. All text between the `@link` and `@endlink` commands serves as text for a link to the `<link-object>` specified as the first argument of `@link`."],
        ["ref", "${1:name} \"${2:text}\"", "Creates a reference to a named section, subsection, page or anchor. For HTML documentation the reference command will generate a link to the section. For a section or subsection the title of the section will be used as the text of the link. For an anchor the optional text between quotes will be used or `<name>` if no text is specified. For LATEX documentation the reference command will generate a section number for sections or the text followed by a page number if `<name>` refers to an anchor."],
        ["refitem", "${1:name}", "Just like the `@ref` command, this command creates a reference to a named section, but this reference appears in a list that is started by `@secreflist` and ends with `@endsecreflist`."],
        ["secreflist", "$1\n@endsecreflist", "Starts an index list of item, created with `@refitem` that each link to a named section."],
        ["endsecreflist", "", "End an index list started with `@secreflist`."],
        ["subpage", "${1:name} \"${2:text}\"", "This command can be used to create a hierarchy of pages."],
        ["tableofcontents", "{${1|HTML,LaTeX,XML,DocBook|}:${2:level}}", "Creates a table of contents at the top of a page, listing all sections and subsections in the page."],
        ["section", "${1:section-name} ${2:section title}", "Creates a section with name `<section-name>`."],
        ["subsection", "${1:subsection-name} ${2:subsection title}", "Creates a subsection with name `<subsection-name>`."],
        ["subsubsection", "${1:subsubsection-name} ${2:subsubsection title}", "Creates a subsubsection with name `<subsubsection-name>`."],
        ["paragraph", "${1:paragraph-name} ${2:paragraph title}", "Creates a named paragraph with name `<paragraph-name>`."],
        /*Commands for displaying examples */
        ["include", "{${1|lineno,doc|}} ${2:file-name}", "This command can be used to include a source file as a block of code. Using the `@include` command is equivalent to inserting the file into the documentation block and surrounding it with `@code` and `@endcode` commands."],
        ["line", "${1:pattern}", "This command searches line by line through the example that was last included using `@include` or `@dontinclude` until it finds a non-blank line. If that line contains the specified pattern, it is written to the output."],
        ["skip", "${1:pattern}", "This command searches line by line through the example that was last included using `@include` or `@dontinclude` until it finds a line that contains the specified pattern."],
        ["skipline", "${1:pattern}", "This command searches line by line through the example that was last included using `@include` or `@dontinclude` until it finds a line that contains the specified pattern. It then writes the line to the output."],
        ["snippet", "{${1|lineno,doc|}} ${2:file-name} ${3:block_id}", "Where the `@include` command can be used to include a complete file as source code, this command can be used to quote only a fragment of a source file. In case this is used as `<file-name>` the current file is taken as file to take the snippet from."],
        ["until", "${1:pattern}", "This command writes all lines of the example that was last included using `@include` or `@dontinclude` to the output, until it finds a line containing the specified pattern. The line containing the pattern will be written as well."],
        ["verbinclude", "${1:file-name}", "This command includes the contents of the file `<file-name>` verbatim in the documentation. The command is equivalent to pasting the contents of the file in the documentation and placing `@verbatim` and `@endverbatim` commands around it."],
        ["htmlinclude", "${1:[block]} ${2:file-name}", "This command includes the contents of the file `<file-name>` as is in the HTML documentation and tagged with `<htmlonly>` in the generated XML output. The command is equivalent to pasting the contents of the file in the documentation and placing `@htmlonly` and `@endhtmlonly` commands around it."],
        ["latexinclude", "${1:file-name}", "This command includes the contents of the file `<file-name>` as is in the LaTeX documentation and tagged with `<latexonly>` in the generated XML output. The command is equivalent to pasting the contents of the file in the documentation and placing `@latexonly` and `@endlatexonly` commands around it."],
        ["rtfinclude", "${1:file-name}", "This command includes the contents of the file `<file-name>` as is in the RTF documentation and tagged with `<rtfonly>` in the generated XML output. The command is equivalent to pasting the contents of the file in the documentation and placing `@rtfonly` and `@endrtfonly` commands around it."],
        ["maninclude", "${1:file-name}", "This command includes the contents of the file `<file-name>` as is in the MAN documentation and tagged with `<manonly>` in the generated XML output. The command is equivalent to pasting the contents of the file in the documentation and placing `@manonly` and `@endmanonly` commands around it."],
        ["docbookinclude", "${1:file-name}", "This command includes the contents of the file `<file-name>` as is in the DocBook documentation and tagged with `<docbookonly>` in the generated XML output. The command is equivalent to pasting the contents of the file in the documentation and placing `@docbookonly` and `@enddocbookonly` commands around it."],
        ["xmlinclude", "${1:file-name}", "This command includes contents of the the file `<file-name>` as is in the XML documentation. The command is equivalent to pasting the contents of the file in the documentation and placing `@xmlonly` and `@endxmlonly` commands around it."],
    ];
    public static completionItems = (() => {
        const items: vscode.CompletionItem[] = [];
        for (const item of DoxygenCompletionItemProvider.commands) {
            const newItem = new vscode.CompletionItem(item[0]);
            newItem.documentation = new vscode.MarkdownString(item[2]);
            newItem.insertText = new vscode.SnippetString(`${item[0]} ${item[1]}`);
            newItem.kind = vscode.CompletionItemKind.Snippet;
            items.push(newItem);
        }
        return items;
    })();

    public trigger: string = "";
    public indentSpace: number;
    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        if (inComment(vscode.window.activeTextEditor, position.line + 1)) {
            this.trigger = context.triggerCharacter;
            this.indentSpace = position.character;
            return DoxygenCompletionItemProvider.completionItems;
        }
        return [];
    }

    public resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken) {
        let insertion = (item.insertText as vscode.SnippetString).value;
        if (this.trigger === "\\") {
            insertion = insertion.replace("@", "\\");
        }
        const indentPrefix = "\n".concat("* ");
        insertion = insertion.replace(/\n/g, indentPrefix);

        /*insert an empty line if the snippet is multi-line, so * can be auto-completed */
        if (insertion.includes("\n")) {
            insertion = insertion.concat(indentPrefix);
        }

        const newItem = new vscode.CompletionItem(item.label, item.kind);
        newItem.documentation = item.documentation;
        newItem.insertText = new vscode.SnippetString(insertion);
        return newItem;
    }
}

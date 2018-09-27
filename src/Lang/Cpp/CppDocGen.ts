import * as moment from "moment";
import { Position, Range, Selection, TextEditor, TextLine, WorkspaceEdit } from "vscode";
import { IDocGen } from "../../Common/IDocGen";
import { Config } from "../../Config";
import { CppArgument } from "./CppArgument";
import * as CppParser from "./CppParser";
import { CppParseTree } from "./CppParseTree";
import { CppToken, CppTokenType } from "./CppToken";

export enum SpecialCase {
    none,
    constructor,
    destructor,
    getter,
    setter,
    factoryMethod,
}

export enum CommentType {
    method,
    file,
}

export enum CasingType {
    Pascal,
    camel,
    snake,
    SCREAMING_SNAKE,
    UPPER,
    uncertain,
}

export class CppDocGen implements IDocGen {
    protected activeEditor: TextEditor;

    protected readonly cfg: Config;

    protected func: CppArgument;
    protected templateParams: string[];
    protected params: CppArgument[];

    protected specialCase: SpecialCase;
    protected commentType: CommentType;
    protected casingType: CasingType;

    protected smartTextLength: number;

    /**
     * @param  {TextEditor} actEdit Active editor window
     * @param  {Position} cursorPosition Where the cursor of the user currently is
     * @param  {string[]} templateParams The template parameters of the declaration.
     * @param  {CppArgument} func The type and name of the function to generate doxygen.
     *                          Doesn't contain anything if it is not a function.
     * @param  {CppArgument[]} params The parameters of the function. Doesn't contain anything if it is not a function.
     */
    public constructor(
        actEdit: TextEditor,
        cursorPosition: Position,
        cfg: Config,
        templateParams: string[],
        func: CppArgument,
        params: CppArgument[],
        specialCase: SpecialCase,
        commentType: CommentType,
        casingType: CasingType,
    ) {
        this.activeEditor = actEdit;
        this.cfg = cfg;
        this.templateParams = templateParams;
        this.func = func;
        this.params = params;
        this.specialCase = specialCase;
        this.commentType = commentType;
        this.smartTextLength = 0;
        this.casingType = casingType;
    }

    /**
     * @inheritdoc
     */
    public GenerateDoc(rangeToReplace: Range) {
        let comment: string = "";
        if (this.commentType === CommentType.file) {
            comment = this.generateFileDescription();
        } else if (this.commentType === CommentType.method) {
            comment = this.generateComment();
        }

        this.activeEditor.edit((editBuilder) => {
            editBuilder.replace(rangeToReplace, comment); // Insert the comment
        });

        // Set cursor to first DoxyGen command.
        this.moveCursurToFirstDoxyCommand(comment, rangeToReplace.start.line, rangeToReplace.start.character);
    }

    /***************************************************************************
                                    Implementation
     ***************************************************************************/
    protected getIndentation(): string {
        return this.activeEditor.document.lineAt(this.activeEditor.selection.start.line).text.match("^\\s*")[0];
    }

    protected getTemplatedString(replace: string, template: string, param: string): string {
        return template.replace(replace, param);
    }

    protected getMultiTemplatedString(replace: string[], template: string, param: string[]): string {
        // FIXME I find this argument order a bit strange.  I would probably have template first
        // For each replace entry, attempt to replace it with the corresponding param in the template
        for (let i = 0; i < replace.length; i++) {
            if (i < param.length) {
              template = template.replace(replace[i], param[i]);
            }
            // TODO: warn if mismatch string lengths?  Probably should use tuple of tuples
        }
        return template;
    }

    protected getSmartText(): string {
        if (!this.cfg.Generic.generateSmartText) {
            return "";
        }
        let val: string = "";
        let text: string = "";
        switch (this.specialCase) {
            case SpecialCase.constructor: {
                if (this.func.name === null) {
                    return "";
                } else {
                    const ctorText = this.func.name.trim();
                    this.casingType = CppParser.default.checkCasing(ctorText, 0);
                    val = this.splitCasing(ctorText).trim();
                    text = this.cfg.Cpp.ctorText;
                    break;
                }
            }
            case SpecialCase.destructor: {
                if (this.func.name === null) {
                    return "";
                } else {
                    const dtorText = this.func.name.replace("~", "").trim();
                    this.casingType = CppParser.default.checkCasing(dtorText, 0);
                    val = this.splitCasing(dtorText).trim();
                    text = this.cfg.Cpp.dtorText;
                    break;
                }
            }
            case SpecialCase.getter: {
                val = this.splitCasing(this.func.name.trim()).trim().substr(3).trim();
                text = this.cfg.C.getterText;
                break;
            }
            case SpecialCase.setter: {
                val = this.splitCasing(this.func.name.trim()).trim().substr(3).trim();
                text = this.cfg.C.setterText;
                break;
            }
            case SpecialCase.factoryMethod: {
                val = this.splitCasing(this.func.name.trim()).trim().substr(6).trim();
                text = this.cfg.C.factoryMethodText;
                break;
            }
            case SpecialCase.none:
            default: {
                return "";
            }
        }
        const str = this.getTemplatedString(this.cfg.nameTemplateReplace,
            text,
            val);
        this.smartTextLength = str.length;
        return str;
    }

    protected generateBrief(lines: string[]) {
        lines.push(this.getTemplatedString(this.cfg.textTemplateReplace,
                                           this.cfg.C.commentPrefix + this.cfg.Generic.briefTemplate,
                                           this.getSmartText()));
    }

    protected generateFromTemplate(lines: string[], replace: string, template: string, templateWith: string[]) {
        let line: string = "";

        templateWith.forEach((element: string) => {
            // Ignore null values
            if (element !== null) {
                line = this.cfg.C.commentPrefix;
                line += this.getTemplatedString(replace, template, element);
                lines.push(line);
            }
        });
    }

    protected generateReturnParams(): string[] {
        if (this.cfg.Generic.includeTypeAtReturn === false) {
            return [""];
        }

        const params: string[] = [];

        // Check if return type is a pointer
        const ptrReturnIndex = this.func.type.nodes
            .findIndex((n) => n instanceof CppToken && n.type === CppTokenType.Pointer);

        // Special case for void functions.
        const voidReturnIndex = this.func.type.nodes
            .findIndex((n) => n instanceof CppToken && n.type === CppTokenType.Symbol && n.value === "void");

        // Special case for bool return type.
        const boolReturnIndex: number = this.func.type.nodes
            .findIndex((n) => n instanceof CppToken && n.type === CppTokenType.Symbol && n.value === "bool");

        if (boolReturnIndex !== -1 && this.cfg.Generic.boolReturnsTrueFalse === true) {
            params.push("true");
            params.push("false");
        } else if (voidReturnIndex !== -1 && ptrReturnIndex !== -1) {
            params.push(this.cfg.Generic.includeTypeAtReturn === true ? this.func.type.Yield() : "");
        } else if (voidReturnIndex === -1 && this.func.type.nodes.length > 0) {
            params.push(this.cfg.Generic.includeTypeAtReturn === true ? this.func.type.Yield() : "");
        }

        return params;
    }

    protected generateAuthorTag(lines: string[]) {
        if (this.cfg.Generic.authorTag.trim().length !== 0) {
            // Allow substitution of {author} and {email} only
            lines.push(this.cfg.C.commentPrefix +
                this.getMultiTemplatedString(
                    [this.cfg.authorTemplateReplace, this.cfg.emailTemplateReplace],
                    this.cfg.Generic.authorTag,
                    [this.cfg.Generic.authorName, this.cfg.Generic.authorEmail],
                ),
            );
        }
    }

    protected generateFilenameFromTemplate(lines: string[]) {
        if (this.cfg.File.fileTemplate.trim().length !== 0) {
            this.generateFromTemplate(
                lines,
                this.cfg.nameTemplateReplace,
                this.cfg.File.fileTemplate,
                [this.activeEditor.document.fileName.replace(/^.*[\\\/]/, "")],
            );
        }
    }

    protected generateVersionTag(lines: string[]) {
        if (this.cfg.File.versionTag.trim().length !== 0) {
            lines.push(this.cfg.C.commentPrefix + this.cfg.File.versionTag);
        }
    }

    protected generateCopyrightTag(lines: string[]) {
        // This currently only supports year substitution
        this.cfg.File.copyrightTag.forEach((element) => {
            this.generateFromTemplate(
                lines,
                this.cfg.yearTemplateReplace,
                element,
                [moment().format("YYYY")],
            );
        });
    }

    protected generateCustomTag(lines: string[]) {
        let dateFormat: string = "YYYY-MM-DD"; // Default to ISO standard if not defined
        if ( this.cfg.Generic.dateFormat.trim().length !== 0) {
            dateFormat = this.cfg.Generic.dateFormat; // Overwrite with user format
        }
        // For each line of the customTag
        this.cfg.File.customTag.forEach((element) => {
            // Allow any of date, year, author, email to be replaced
            lines.push(this.cfg.C.commentPrefix +
                this.getMultiTemplatedString(
                    [this.cfg.authorTemplateReplace, this.cfg.emailTemplateReplace,
                        this.cfg.dateTemplateReplace, this.cfg.yearTemplateReplace],
                    element,
                    [this.cfg.Generic.authorName, this.cfg.Generic.authorEmail,
                        moment().format(dateFormat), moment().format("YYYY")],
                ),
            );
        });
    }

    protected generateDateFromTemplate(lines: string[]) {
        if (this.cfg.Generic.dateTemplate.trim().length !== 0 &&
            this.cfg.Generic.dateFormat.trim().length !== 0) {
            this.generateFromTemplate(
                lines,
                this.cfg.dateTemplateReplace,
                this.cfg.Generic.dateTemplate,
                [moment().format(this.cfg.Generic.dateFormat)],
            );
        }
    }

    protected insertFirstLine(lines: string[]) {
        if (this.cfg.C.firstLine.trim().length !== 0) {
            lines.push(this.cfg.C.firstLine);
        }
    }

    protected insertBrief(lines: string[]) {
        if (this.cfg.Generic.briefTemplate.trim().length !== 0) {
            this.generateBrief(lines);
        }
    }

    protected insertLastLine(lines: string[]) {
        if (this.cfg.C.lastLine.trim().length !== 0) {
            lines.push(this.cfg.C.lastLine);
        }
    }

    protected generateFileDescription(): string {
        const lines: string[] = [];

        this.insertFirstLine(lines);

        this.cfg.File.fileOrder.forEach((element) => {
            switch (element) {
                case "brief": {
                    this.insertBrief(lines);
                    break;
                }
                case "empty": {
                    lines.push(this.cfg.C.commentPrefix);
                    break;
                }
                case "file": {
                    this.generateFilenameFromTemplate(lines);
                    break;
                }
                case "version": {
                    this.generateVersionTag(lines);
                    break;
                }
                case "author": {
                    this.generateAuthorTag(lines);
                    break;
                }
                case "date": {
                    this.generateDateFromTemplate(lines);
                    break;
                }
                case "copyright": {
                    this.generateCopyrightTag(lines);
                    break;
                }
                case "custom": {
                    this.generateCustomTag(lines);
                    break;
                }
                default: {
                    break;
                }
            }
        });

        this.insertLastLine(lines);

        return lines.join("\n");
    }

    protected generateComment(): string {
        const lines: string[] = [];

        this.insertFirstLine(lines);

        this.cfg.Generic.order.forEach((element) => {
            switch (element) {
                case "brief": {
                    this.insertBrief(lines);
                    break;
                }
                case "empty": {
                    lines.push(this.cfg.C.commentPrefix);
                    break;
                }
                case "tparam": {
                    if (this.cfg.Cpp.tparamTemplate.trim().length !== 0 && this.templateParams.length > 0) {
                        this.generateFromTemplate(
                            lines,
                            this.cfg.paramTemplateReplace,
                            this.cfg.Cpp.tparamTemplate,
                            this.templateParams,
                        );
                    }
                    break;
                }
                case "param": {
                    if (this.cfg.Generic.paramTemplate.trim().length !== 0 && this.params.length > 0) {
                        const paramNames: string[] = this.params.map((p) => p.name);
                        // tslint:disable-next-line:max-line-length
                        this.generateFromTemplate(lines, this.cfg.paramTemplateReplace, this.cfg.Generic.paramTemplate, paramNames);
                    }
                    break;
                }
                case "return": {
                    if (this.cfg.Generic.returnTemplate.trim().length !== 0 && this.func.type !== null) {
                        const returnParams = this.generateReturnParams();
                        // tslint:disable-next-line:max-line-length
                        this.generateFromTemplate(lines, this.cfg.typeTemplateReplace, this.cfg.Generic.returnTemplate, returnParams);
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        });

        this.insertLastLine(lines);

        const comment: string = lines.join("\n" + this.getIndentation());
        return comment;
    }

    protected moveCursurToFirstDoxyCommand(comment: string, baseLine: number, baseCharacter) {
        // Find first offset of a new line in the comment. Since that's when the line where the first param starts.
        let line: number = baseLine;
        let character: number = comment.indexOf("\n");

        // If a first line is included find the 2nd line with a newline.
        if (this.cfg.C.firstLine.trim().length !== 0) {
            line++;
            const oldCharacter: number = character;
            character = comment.indexOf("\n", oldCharacter + 1) - oldCharacter;
        }

        // If newline is not found means no first param was found so Set to base line before the newline.
        if (character < 0) {
            line = baseLine;
            character = baseCharacter;
        }
        const to: Position = new Position(line, character);
        this.activeEditor.selection = new Selection(to, to);
    }

    protected splitCasing(text: string): string {
        if (!this.cfg.Generic.splitCasingSmartText) {
            return text;
        }
        let txt = text;
        let vals: string[] = [];
        switch (this.casingType) {
            case CasingType.SCREAMING_SNAKE: {
                txt = txt.toLowerCase();
            }
            case CasingType.snake: {
                vals = txt.split("_");
                break;
            }
            case CasingType.Pascal: {
                txt = txt.replace(/([A-Z0-9])/g, " $1");
                vals.push(txt);
                break;
            }
            case CasingType.camel: {
                txt = txt.replace(/([a-zA-Z0-9])(?=[A-Z])/g, "$1 ");
                vals.push(txt);
                break;
            }
            case CasingType.UPPER:
            case CasingType.uncertain:
            default: {
                return text;
            }
        }

        return vals.join(" ");
    }
}

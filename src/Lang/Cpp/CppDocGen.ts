import * as moment from "moment";
import { Position, Range, Selection, TextEditor, TextLine, WorkspaceEdit } from "vscode";
import { IDocGen } from "../../Common/IDocGen";
import { Config } from "../../Config";
import { CppArgument } from "./CppArgument";
import { CppParseTree } from "./CppParseTree";
import { CppToken, CppTokenType } from "./CppToken";

export enum SpecialCase {
    none,
    constructor,
    destructor,
}

export enum CommentType {
    method,
    file,
}

export class CppDocGen implements IDocGen {
    protected activeEditor: TextEditor;

    protected readonly cfg: Config;

    protected func: CppArgument;
    protected templateParams: string[];
    protected params: CppArgument[];

    protected specialCase: SpecialCase;
    protected commentType: CommentType;

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
    ) {
        this.activeEditor = actEdit;
        this.cfg = cfg;
        this.templateParams = templateParams;
        this.func = func;
        this.params = params;
        this.specialCase = specialCase;
        this.commentType = commentType;
    }

    /**
     * @inheritdoc
     */
    public GenerateDoc(rangeToReplace: Range) {
        let comment: string;
        if (this.commentType === CommentType.file) {
            comment = this.generateFileDescription();
        } else {
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

    protected getSmartText(): string {
        // todo: Make the text customizable
        switch (this.specialCase) {
            case SpecialCase.constructor: {
                if (this.func.name === null) {
                    return "";
                } else {
                    return "Construct a new " + this.func.name.trim() + " object";
                }
            }
            case SpecialCase.destructor: {
                if (this.func.name === null) {
                    return "";
                } else {
                    return "Destroy the " + this.func.name.replace("~", "").trim() + " object";
                }
            }
            // tslint:disable-next-line:no-empty
            case SpecialCase.none:
            default: {
                return "";
            }
        }
    }

    protected generateBrief(lines: string[]) {
        lines.push(this.cfg.commentPrefix + this.cfg.briefTemplate + this.getSmartText());
    }

    protected generateFromTemplate(lines: string[], replace: string, template: string, templateWith: string[]) {
        let line: string = "";

        templateWith.forEach((element: string) => {
            // Ignore null values
            if (element !== null) {
                line = this.cfg.commentPrefix;
                line += this.getTemplatedString(replace, template, element);
                lines.push(line);
            }
        });
    }

    protected generateReturnParams(): string[] {
        if (this.cfg.includeTypeAtReturn === false) {
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

        if (boolReturnIndex !== -1 && this.cfg.boolReturnsTrueFalse === true) {
            params.push("true");
            params.push("false");
        } else if (voidReturnIndex !== -1 && ptrReturnIndex !== -1) {
            params.push(this.cfg.includeTypeAtReturn === true ? this.func.type.Yield() : "");
        } else if (voidReturnIndex === -1 && this.func.type.nodes.length > 0) {
            params.push(this.cfg.includeTypeAtReturn === true ? this.func.type.Yield() : "");
        }

        return params;
    }

    protected generateAuthorTag(lines: string[]) {
        if (this.cfg.authorTag.trim().length !== 0) {
            lines.push(this.cfg.commentPrefix + this.cfg.authorTag);
        }
    }

    protected generateFilenameFromTemplate(lines: string[]) {
        if (this.cfg.fileTemplate.trim().length !== 0) {
            this.generateFromTemplate(
                lines,
                this.cfg.nameTemplateReplace,
                this.cfg.fileTemplate,
                [this.activeEditor.document.fileName.replace(/^.*[\\\/]/, "")],
            );
        }
    }

    protected generateDateFromTemplate(lines: string[]) {
        if (this.cfg.dateTemplate.trim().length !== 0 &&
            this.cfg.dateFormat.trim().length !== 0) {
            this.generateFromTemplate(
                lines,
                this.cfg.dateTemplateReplace,
                this.cfg.dateTemplate,
                [moment().format(this.cfg.dateFormat)],
            );
        }
    }

    protected insertFirstLine(lines: string[]) {
        if (this.cfg.firstLine.trim().length !== 0) {
            lines.push(this.cfg.firstLine);
        }
    }

    protected insertBrief(lines: string[]) {
        if (this.cfg.briefTemplate.trim().length !== 0) {
            this.generateBrief(lines);
            if (this.cfg.newLineAfterBrief === true) {
                lines.push(this.cfg.commentPrefix);
            }
        }
    }

    protected insertLastLine(lines: string[]) {
        if (this.cfg.lastLine.trim().length !== 0) {
            lines.push(this.cfg.lastLine);
        }
    }

    protected generateFileDescription(): string {
        const lines: string[] = [];

        this.insertFirstLine(lines);

        this.cfg.fileOrder.forEach((element) => {
            switch (element) {
                case "brief": {
                    this.insertBrief(lines);
                    break;
                }
                case "file": {
                    this.generateFilenameFromTemplate(lines);
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

        this.insertBrief(lines);

        if (this.cfg.tparamTemplate.trim().length !== 0 && this.templateParams.length > 0) {
            this.generateFromTemplate(
                lines,
                this.cfg.paramTemplateReplace,
                this.cfg.tparamTemplate,
                this.templateParams,
            );
            if (this.cfg.newLineAfterTParams === true) {
                lines.push(this.cfg.commentPrefix);
            }
        }

        if (this.cfg.paramTemplate.trim().length !== 0 && this.params.length > 0) {
            const paramNames: string[] = this.params.map((p) => p.name);
            this.generateFromTemplate(lines, this.cfg.paramTemplateReplace, this.cfg.paramTemplate, paramNames);
            if (this.cfg.newLineAfterParams === true) {
                lines.push(this.cfg.commentPrefix);
            }
        }

        if (this.cfg.returnTemplate.trim().length !== 0 && this.func.type !== null) {
            const returnParams = this.generateReturnParams();
            this.generateFromTemplate(lines, this.cfg.typeTemplateReplace, this.cfg.returnTemplate, returnParams);
        }

        this.insertLastLine(lines);

        const comment: string = lines.join("\n" + this.getIndentation());
        return comment;
    }

    protected moveCursurToFirstDoxyCommand(comment: string, baseLine: number, baseCharacter) {
        // Find first offset of a new line in the comment. Since that's when the line where the first param starts.
        let line: number = baseLine;
        let character: number = comment.indexOf("\n");

        // If a first line is included find the 2nd line with a newline.
        if (this.cfg.firstLine.trim().length !== 0) {
            line++;
            const oldCharacter: number = character;
            character = comment.indexOf("\n", oldCharacter + 1) - oldCharacter;
        }

        // If newline is not found means no first param was found so Set to base line before the newline.
        if (character < 0) {
            line = baseLine;
            character = baseCharacter;
        }

        const moveTo: Position = new Position(line, character);
        this.activeEditor.selection = new Selection(moveTo, moveTo);
    }
}

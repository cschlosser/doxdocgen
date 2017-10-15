import { Position, Range, Selection, TextEditor, TextLine, workspace, WorkspaceEdit } from "vscode";
import { Config, ConfigType } from "../Config";
import { IDocGen } from "./DocGen";

export default class CGen implements IDocGen {
    protected firstLine: string;
    protected commentPrefix: string;
    protected lastLine: string;
    protected newLineAfterBrief: boolean;
    protected newLineAfterParams: boolean;
    protected newLineAfterTParams: boolean;
    protected includeTypeAtReturn: boolean;
    protected briefTemplate: string;
    protected paramTemplate: string;
    protected tparamTemplate: string;
    protected returnTemplate: string;

    protected templateReplaceString: string;

    protected activeEditor: TextEditor;

    protected retVals: string[];
    protected params: string[];
    protected tparams: string[];

    /**
     * @param  {TextEditor} actEdit Active editor window
     * @param  {Position} cursorPosition Where the cursor of the user currently is
     * @param  {string[]} param The parameter names of the method extracted by the parser
     * @param  {string[]} tparam The template parameter names of the method extracted by the parser.
     * @param  {string[]} returnVals The return values extracted by the parser
     */
    public constructor(
        actEdit: TextEditor,
        cursorPosition:
        Position,
        param: string[],
        tparam: string[],
        returnVals: string[],
    ) {
        this.activeEditor = actEdit;
        this.templateReplaceString = "{param}";
        this.params = param;
        this.tparams = tparam;
        this.retVals = returnVals;
    }

    /**
     * @inheritdoc
     */
    public GenerateDoc(rangeToReplace: Range) {
        this.readConfig();
        const comment: string = this.generateComment();

        this.activeEditor.edit((editBuilder) => {
            editBuilder.replace(rangeToReplace, comment); // Insert the comment
        });

        // Set cursor to first DoxyGen command.
        this.moveCursurToFirstDoxyCommand(comment, rangeToReplace.start.line, rangeToReplace.start.character);
    }

    /***************************************************************************
                                    Implementation
     ***************************************************************************/

    protected readConfig() {
        const getCfg = workspace.getConfiguration;

        this.firstLine = getCfg(ConfigType.generic).get<string>(Config.firstLine, "/**");
        this.commentPrefix = getCfg(ConfigType.generic).get<string>(Config.commentPrefix, " * ");
        this.lastLine = getCfg(ConfigType.generic).get<string>(Config.lastLine, "**/");
        this.newLineAfterBrief = getCfg(ConfigType.generic).get<boolean>(Config.newLineAfterBrief, true);
        this.newLineAfterParams = getCfg(ConfigType.generic).get<boolean>(Config.newLineAfterParams, false);
        this.newLineAfterTParams = getCfg(ConfigType.generic).get<boolean>(Config.newLineAfterTParams, false);
        this.includeTypeAtReturn = getCfg(ConfigType.generic).get<boolean>(Config.includeTypeAtReturn, false);
        this.briefTemplate = getCfg(ConfigType.generic).get<string>(Config.briefTemplate, "@brief ");
        this.paramTemplate = getCfg(ConfigType.generic).get<string>(Config.paramTemplate, "@param {param} ");
        this.tparamTemplate = getCfg(ConfigType.generic).get<string>(Config.tparamTemplate, "@tparam {param} ");
        this.returnTemplate = getCfg(ConfigType.generic).get<string>(Config.returnTemplate, "@return {param} ");
    }

    protected getIndentation(): string {
        const line: TextLine = this.activeEditor.document.lineAt(this.activeEditor.selection.start.line);
        const lineTxt: string = line.text;
        let stringToIndent: string = "";
        // Find indentation from previous line
        for (let i = 0; i < line.firstNonWhitespaceCharacterIndex; i++) {
            if (lineTxt.charAt(i) === "\t") {
                stringToIndent = stringToIndent + "\t";
            } else if (lineTxt.charAt(i) === " ") {
                stringToIndent = stringToIndent + " ";
            }
        }
        return stringToIndent;
    }

    protected getTemplatedString(template: string, param: string): string {
        return template.replace(this.templateReplaceString, param);
    }

    protected generateBrief(lines: string[]) {
        lines.push(this.commentPrefix + this.briefTemplate);
    }

    protected generateFromTemplate(lines: string[], template: string, templateWith: string[]) {
        let line: string = "";

        templateWith.forEach((element: string) => {
            line = this.commentPrefix;
            line += this.getTemplatedString(template, element);
            lines.push(line);
        });
    }

    protected generateComment(): string {
        const lines: string[] = [];

        if (this.firstLine.trim().length !== 0) {
            lines.push(this.firstLine);
        }

        if (this.briefTemplate.trim().length !== 0) {
            this.generateBrief(lines);
            if (this.newLineAfterBrief === true) {
                lines.push(this.commentPrefix);
            }
        }

        if (this.tparamTemplate.trim().length !== 0 && this.tparams.length > 0) {
            this.generateFromTemplate(lines, this.tparamTemplate, this.tparams);
            if (this.newLineAfterTParams === true) {
                lines.push(this.commentPrefix);
            }
        }

        if (this.paramTemplate.trim().length !== 0 && this.params.length > 0) {
            this.generateFromTemplate(lines, this.paramTemplate, this.params);
            if (this.newLineAfterParams === true) {
                lines.push(this.commentPrefix);
            }
        }

        if (this.returnTemplate.trim().length !== 0 && this.retVals.length > 0) {
            if (this.includeTypeAtReturn === false) {
                this.retVals = this.retVals.map((t) => t === "true" || t === "false" ? t : "");
            }

            this.generateFromTemplate(lines, this.returnTemplate, this.retVals);
        }

        if (this.lastLine.trim().length !== 0) {
            lines.push(this.lastLine);
        }

        const comment: string = lines.join("\n" + this.getIndentation());
        return comment;
    }

    protected moveCursurToFirstDoxyCommand(comment: string, baseLine: number, baseCharacter) {
        // Find first offset of a new line in the comment. Since that's when the line where the first param starts.
        let line: number = baseLine;
        let character: number = comment.indexOf("\n");

        // If a first line is included find the 2nd line with a newline.
        if (this.firstLine.trim().length !== 0) {
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

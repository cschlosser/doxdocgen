import { Position, Range, Selection, TextEditor, TextLine, WorkspaceEdit, workspace } from "vscode";
import { IDocGen } from "./DocGen";
import { Config, ConfigType } from "../Config";

export default class CGen implements IDocGen {
    protected firstLine: string;
    protected commentPrefix: string;
    protected lastLine: string;
    protected newLineAfterBrief: boolean;
    protected newLineAfterParams: boolean;
    protected newLineAfterTParams: boolean;
    protected briefTemplate: string;
    protected paramTemplate: string;
    protected tparamTemplate: string;
    protected returnTemplate: string;

    protected templateReplaceString: string;

    protected activeEditor: TextEditor;
    protected position: Position;
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
    public constructor(actEdit: TextEditor, cursorPosition: Position, param: string[], tparam: string[], returnVals: string[]) {
        this.activeEditor = actEdit;
        this.position = cursorPosition;
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

        // Set cursor after brief command
        this.setCursorToBrief(rangeToReplace.start.line, rangeToReplace.start.character);
    }

    /***************************************************************************
                                    Implementation
     ***************************************************************************/

    protected readConfig() {        
        this.firstLine = workspace.getConfiguration(ConfigType.generic).get<string>(Config.firstLine, "");
        this.commentPrefix = workspace.getConfiguration(ConfigType.generic).get<string>(Config.commentPrefix, "");
        this.lastLine = workspace.getConfiguration(ConfigType.generic).get<string>(Config.lastLine, "");
        this.newLineAfterBrief = workspace.getConfiguration(ConfigType.generic).get<boolean>(Config.newLineAfterBrief, true);
        this.newLineAfterParams = workspace.getConfiguration(ConfigType.generic).get<boolean>(Config.newLineAfterParams, false);
        this.newLineAfterTParams = workspace.getConfiguration(ConfigType.generic).get<boolean>(Config.newLineAfterTParams, false);
        this.briefTemplate = workspace.getConfiguration(ConfigType.generic).get<string>(Config.briefTemplate, "");
        this.paramTemplate = workspace.getConfiguration(ConfigType.generic).get<string>(Config.paramTemplate, "");
        this.tparamTemplate = workspace.getConfiguration(ConfigType.generic).get<string>(Config.tparamTemplate, "");
        this.returnTemplate = workspace.getConfiguration(ConfigType.generic).get<string>(Config.returnTemplate, "");
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
        let lines: string[] = [];
        
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
            this.generateFromTemplate(lines, this.returnTemplate, this.retVals);
        }

        if (this.lastLine.trim().length !== 0) {
            lines.push(this.lastLine);            
        }

        const comment: string = lines.join("\n" + this.getIndentation());
        return comment;
    }

    protected setCursorToBrief(line: number, character: number) {
        // If there was a first line defined the brief is on the next line.
        if (this.firstLine.trim().length !== 0) {
            line++;
        }
        
        character += this.commentPrefix.length + this.briefTemplate.length;
        
        const move: Selection = new Selection(line, character, line, character);
        this.activeEditor.selection = move;
    }
}

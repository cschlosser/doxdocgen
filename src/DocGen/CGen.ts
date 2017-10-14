import { Position, Range, Selection, TextEditor, TextLine, WorkspaceEdit } from "vscode";
import { DoxygenCommands, IDocGen } from "./DocGen";

export default class CGen implements IDocGen {
    protected lineStart: string;
    protected endComment: string;
    protected commandIndicator: string;
    protected spaceAfterCommand: string;
    protected activeEditor: TextEditor;
    protected position: Position;
    protected comment: string;
    protected retVals: string[];
    protected params: string[];

    /**
     * @param  {TextEditor} actEdit Active editor window
     * @param  {Position} cursorPosition Where the cursor of the user currently is
     * @param  {string[]} param The parameter names of the method extracted by the parser
     * @param  {string[]} returnVals The return values extracted by the parser
     */
    public constructor(actEdit: TextEditor, cursorPosition: Position, param: string[], returnVals: string[]) {
        this.activeEditor = actEdit;
        this.position = cursorPosition;
        this.comment = "\n"; // Add the new line after the comment indicator
        this.params = param;
        this.retVals = returnVals;
    }

    /**
     * @inheritdoc
     */
    public GenerateDoc() {
        this.readConfig();
        this.generateComment();

        const oldPos: Position = this.position;

        const active: Position = this.activeEditor.selection.active;
        const anchor: Position = new Position(active.line + 1, active.character); // Start at the next line
        const replaceSelection = new Selection(anchor, active);
        this.activeEditor.edit((editBuilder) => {
            editBuilder.replace(replaceSelection, this.comment); // Insert the comment
        });

        // Set cursor after brief command
        this.setCursor(oldPos.line + 3, oldPos.character);
        const newSelectActive = new Position(oldPos.line + 3, oldPos.character + DoxygenCommands.detailed.length);
        const newSelectPos = new Position(oldPos.line + 3, oldPos.character);
        this.activeEditor.selection = new Selection(newSelectPos, newSelectActive);
    }

    /***************************************************************************
                                    Implementation
     ***************************************************************************/

    protected readConfig() {
        this.lineStart = " * "; // TODO: make this customizable
        this.endComment = "*/"; // TODO: make this customizable
        this.commandIndicator = "@"; // TODO: make this customizable
        this.spaceAfterCommand = " "; // TODO: make this customizable
    }

    protected indentLine(commentLine: string): string {
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
        const textToInsert = stringToIndent + commentLine;
        return textToInsert;
    }

    protected generateBrief() {
        let line: string = "";
        line += this.lineStart;
        line += this.commandIndicator;
        line += DoxygenCommands.brief;
        line += this.spaceAfterCommand;
        this.comment += this.indentLine(line);
    }

    protected generateDetailed() {
        let line: string = "";
        line += this.lineStart;
        line += "\n";
        this.comment += this.indentLine(line);
        line = this.lineStart;
        line += DoxygenCommands.detailed + "\n";
        this.comment += this.indentLine(line);
        line = this.lineStart;
        this.comment += this.indentLine(line);
    }

    protected generateParams() {
        let line: string = "";

        this.params.forEach((element: string) => {
            line = this.lineStart;
            line += this.commandIndicator;
            line += DoxygenCommands.param + " "; // TODO: Make this customizable
            line += element + "\n";
            this.comment += this.indentLine(line);
        });
    }

    protected generateReturn() {
        if (this.retVals.length === 0) {
                return;
        }
        let line: string = "";

        if (this.params.length !== 0) {
            line = this.lineStart + "\n";
            this.comment += this.indentLine(line);
        }

        this.retVals.forEach((element: string) => {
            line = this.lineStart;
            line += this.commandIndicator;
            line += DoxygenCommands.return + " "; // TODO: Make this customizable
            line += element.trim() + "\n";
            this.comment += this.indentLine(line);
        });
    }

    protected generateEnd() {
        let line: string = " "; // TODO: Make this customizable
        line += this.endComment;
        this.comment += this.indentLine(line);
    }

    protected generateComment() {
        this.generateBrief();
        this.comment += "\n";
        this.generateDetailed();
        this.comment += "\n";
        if (this.params.length !== 0) { // Only if we have parameters
            this.generateParams();
        }
        if (this.retVals.length !== 0) { // Only if we have return values
            this.generateReturn();
        }
        this.generateEnd();
    }

    protected setCursor(line: number, character: number) {
        const indentLen: number = this.indentLine("").length;
        const move: Selection = new Selection(line, character, line, character);
        this.activeEditor.selection = move;
    }
}

import { Position, TextEditor } from "vscode";
import ICodeParser from "../../Common/ICodeParser";
import { IDocGen } from "../../Common/IDocGen";
import { Config } from "../../Config";
import { PythonDocGen } from "./PythonDocGen";

export default class CppParser implements ICodeParser {

    protected readonly cfg: Config;
    protected activeSelection: Position;
    protected activeEditor: TextEditor;

    constructor(cfg: Config) {
        this.cfg = cfg;
    }

    public Parse(activeEditor: TextEditor): IDocGen {
        this.activeEditor = activeEditor;
        this.activeSelection = activeEditor.selection.active;
        const params = this.getParams(this.getLogicalLine());
        return new PythonDocGen();
    }

    private getLogicalLine(): string {
        let nextLine: Position = new Position(this.activeSelection.line + 1, this.activeSelection.character);
        let nextLineTxt: string = this.activeEditor.document.lineAt(nextLine.line).text.trim();

        let logicalLine = "";
        let linesToGet: number = this.cfg.Generic.linesToGet;
        let foundStart = false;
        while (linesToGet-- > 0) { // Check for end of expression.
            nextLine = new Position(nextLine.line + 1, nextLine.character);
            nextLineTxt = this.activeEditor.document.lineAt(nextLine.line).text.trim();

            if (nextLineTxt.startsWith("def")) {
                foundStart = true;
            }

            if (foundStart) {
                logicalLine += nextLineTxt;
            }

            if (nextLineTxt.endsWith(":")) {
                break;
            }
        }

        return logicalLine;
    }

    private getParams(line: string): string[] {
        return [];
    }
}

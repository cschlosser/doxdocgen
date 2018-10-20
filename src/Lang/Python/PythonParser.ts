import { TextEditor } from "vscode";
import ICodeParser from "../../Common/ICodeParser";
import { IDocGen } from "../../Common/IDocGen";
import { Config } from "../../Config";

export default class CppParser implements ICodeParser {

    protected readonly cfg: Config;

    constructor(cfg: Config) {
        this.cfg = cfg;
    }

    public Parse(activeEditor: TextEditor): IDocGen {
        throw new Error("Method not implemented.");
    }
}

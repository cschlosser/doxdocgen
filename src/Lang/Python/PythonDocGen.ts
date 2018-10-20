import { Range } from "vscode";
import { IDocGen } from "../../Common/IDocGen";

export class PythonDocGen implements IDocGen {
    private params: string[];

    public constructor(params: string[]) {
        this.params = params;
    }

    public GenerateDoc(rangeToReplace: Range) {
        throw new Error("Method not implemented.");
    }
}

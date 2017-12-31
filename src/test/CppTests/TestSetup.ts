import * as vscode from "vscode";

import CodeParser from "../../Common/ICodeParser";
import { IDocGen } from "../../Common/IDocGen";
import { Config } from "../../Config";
import * as myExtension from "../../extension";
import CppParser from "../../Lang/Cpp/CppParser";
import MockDocument from "../tools/MockDocument";
import MockEditor from "../tools/MockEditor";
import MockLine from "../tools/MockLine";
import MockPosition from "../tools/MockPosition";
import MockSelection from "../tools/MockSelection";

export default class TestSetup {
    public cfg: Config;

    private editor: MockEditor;

    constructor(method: string) {
        this.SetLine(method);
    }

    public SetLine(method: string): TestSetup {
        this.cfg = new Config();

        let position: MockPosition;
        position = new MockPosition(0, 0);

        let selection: MockSelection;
        selection = new MockSelection(position);

        let line: MockLine;
        line = new MockLine(method);

        let doc: MockDocument;
        doc = new MockDocument(line);

        this.editor = new MockEditor(selection, doc);

        return this;
    }

    public GetResult(): string {
        let parser: CodeParser;
        parser = new CppParser(new Config());

        const gen: IDocGen = parser.Parse(this.editor);
        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        return this.editor.editBuilder.text;
    }
}

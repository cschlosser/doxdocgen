import * as vscode from "vscode";
import CodeParser from "../../CodeParser/CodeParser";
import CParser from "../../CodeParser/CParser/CParser";
import { IDocGen } from "../../DocGen/DocGen";
import * as myExtension from "../../extension";
import MockDocument from "./MockDocument";
import MockEditor from "./MockEditor";
import MockLine from "./MockLine";
import MockPosition from "./MockPosition";
import MockSelection from "./MockSelection";

export default class TestSetup {
    private editor: MockEditor;

    constructor(method: string) {
        this.SetLine(method);
    }

    public SetLine(method: string): TestSetup {
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
        parser = new CParser();

        const gen: IDocGen = parser.Parse(this.editor);
        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        return this.editor.editBuilder.text;
    }
}

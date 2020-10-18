import * as vscode from "vscode";

import CodeParser from "../../Common/ICodeParser";
import { IDocGen } from "../../Common/IDocGen";
import { Config } from "../../Config";
import * as myExtension from "../../extension";
import GitConfig from "../../GitConfig";
import CppParser from "../../Lang/Cpp/CppParser";
import MockDocument from "../tools/MockDocument";
import MockEditor from "../tools/MockEditor";
import MockLine from "../tools/MockLine";
import MockPosition from "../tools/MockPosition";
import MockSelection from "../tools/MockSelection";

export default class TestSetup {
    public cfg: Config;
    public firstLine: number;
    public gitConfig: GitConfig;
    private editor: MockEditor;

    constructor(method: string) {
        this.gitConfig = new GitConfig();
        this.cfg = new Config();
        this.firstLine = 0;
        this.SetLine(method);
    }

    public SetLine(method: string): TestSetup {
        return this.SetLines([method]);
    }

    public SetLines(lines: string[], addIndent = true): TestSetup {
        let mockLines: MockLine[];

        // Add two empty lines with just the indentation
        // since one is for the triggersequence line.
        // And the other is if the next empty line.
        if (lines.length > 0) {
            if (addIndent === true) {
                const indent: string = lines[0].match("^\\s*")[0];

                mockLines = [indent, indent].concat(lines)
                    .map((l) => new MockLine(l));
            } else {
                mockLines = lines
                    .map((l) => new MockLine(l));
            }
        }

        const selection: MockSelection =  new MockSelection(new MockPosition(this.firstLine, 0));
        const doc: MockDocument = new MockDocument(mockLines);

        this.editor = new MockEditor(selection, doc);

        return this;
    }

    public GetResult(): string {
        let parser: CodeParser;
        parser = new CppParser(this.cfg);

        const gen: IDocGen = parser.Parse(this.editor);
        // tslint:disable-next-line:max-line-length
        gen.GenerateDoc(new vscode.Range(new vscode.Position(this.firstLine, 0), new vscode.Position(this.firstLine, 0)), this.gitConfig);

        return this.editor.editBuilder.text;
    }
}

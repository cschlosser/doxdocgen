import * as vscode from "vscode";
import { TextEditor } from "vscode";
import MockDocument from "./MockDocument";
import MockSelection from "./MockSelection";
import MockTextEditorEdit from "./MockTextEditorEdit";

export default class MockEditor implements TextEditor {
    public document: vscode.TextDocument;
    public selection: vscode.Selection;
    public selections: vscode.Selection[];
    public options: vscode.TextEditorOptions;
    public viewColumn?: vscode.ViewColumn;
    public editBuilder: MockTextEditorEdit;
    public constructor(s: MockSelection, d: MockDocument) {
        this.selection = s;
        this.document = d;
        this.editBuilder = new MockTextEditorEdit();
    }

    public edit(callback: (editBuilder: vscode.TextEditorEdit) => void,
                options?: { undoStopBefore: boolean; undoStopAfter: boolean; }): Thenable<boolean> {
        callback(this.editBuilder);
        return Promise.resolve(true);
    }
    public insertSnippet(snippet: vscode.SnippetString,
                         location?: vscode.Position | vscode.Range | vscode.Position[] | vscode.Range[],
                         options?: { undoStopBefore: boolean; undoStopAfter: boolean; }): Thenable<boolean> {
        throw new Error("Method not implemented.");
    }
    public setDecorations(decorationType: vscode.TextEditorDecorationType,
                          rangesOrOptions: vscode.Range[] | vscode.DecorationOptions[]): void {
        throw new Error("Method not implemented.");
    }
    public revealRange(range: vscode.Range, revealType?: vscode.TextEditorRevealType): void {
        throw new Error("Method not implemented.");
    }
    public show(column?: vscode.ViewColumn): void {
        throw new Error("Method not implemented.");
    }
    public hide(): void {
        throw new Error("Method not implemented.");
    }
}

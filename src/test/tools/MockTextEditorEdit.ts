import * as vscode from "vscode";

export default class MockTextEditorEdit implements vscode.TextEditorEdit {
    public text: string;
    public replace(location: vscode.Position | vscode.Range | vscode.Selection, value: string): void {
        this.text = value;
    }
    public insert(location: vscode.Position, value: string): void {
        throw new Error("Method not implemented.");
    }
    public delete(location: vscode.Range | vscode.Selection): void {
        throw new Error("Method not implemented.");
    }
    public setEndOfLine(endOfLine: vscode.EndOfLine): void {
        throw new Error("Method not implemented.");
    }

}

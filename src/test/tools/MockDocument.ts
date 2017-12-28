import * as vscode from "vscode";
import MockLine from "./MockLine";

export default class MockDocument implements vscode.TextDocument {
    public uri: vscode.Uri;
    public fileName: string;
    public isUntitled: boolean;
    public languageId: string;
    public version: number;
    public isDirty: boolean;
    public isClosed: boolean;
    public eol: vscode.EndOfLine;
    public lineCount: number;
    private line: vscode.TextLine;
    private callCount: number;
    public constructor(line: vscode.TextLine) {
        this.line = line;
        this.callCount = 0;
    }
    public save(): Thenable<boolean> {
        throw new Error("Method not implemented.");
    }
    public lineAt(line: number | vscode.Position): vscode.TextLine;
    public lineAt(position: any): any {
        if (++this.callCount === 1) {
            return new MockLine("");
        } else if (this.callCount === 2) {
            return this.line;
        } else {
            return new MockLine(";");
        }
    }
    public offsetAt(position: vscode.Position): number {
        throw new Error("Method not implemented.");
    }
    public positionAt(offset: number): vscode.Position {
        throw new Error("Method not implemented.");
    }
    public getText(range?: vscode.Range): string {
        throw new Error("Method not implemented.");
    }
    public getWordRangeAtPosition(position: vscode.Position, regex?: RegExp): vscode.Range {
        throw new Error("Method not implemented.");
    }
    public validateRange(range: vscode.Range): vscode.Range {
        throw new Error("Method not implemented.");
    }
    public validatePosition(position: vscode.Position): vscode.Position {
        throw new Error("Method not implemented.");
    }

}

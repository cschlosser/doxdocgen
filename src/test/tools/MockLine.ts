import * as vscode from "vscode";

export default class MockLine implements vscode.TextLine {
    public lineNumber: number;
    public text: string;
    public range: vscode.Range;
    public rangeIncludingLineBreak: vscode.Range;
    public firstNonWhitespaceCharacterIndex: number;
    public isEmptyOrWhitespace: boolean;
    public constructor(text: string) {
        this.text = text;
    }
}

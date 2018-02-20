import * as vscode from "vscode";

export default class MockPosition implements vscode.Position {
    public line: number;
    public character: number;
    public constructor(l: number, c: number) {
        this.line = l;
        this.character = c;
    }
    public isBefore(other: vscode.Position): boolean {
        throw new Error("Method not implemented.");
    }
    public isBeforeOrEqual(other: vscode.Position): boolean {
        throw new Error("Method not implemented.");
    }
    public isAfter(other: vscode.Position): boolean {
        throw new Error("Method not implemented.");
    }
    public isAfterOrEqual(other: vscode.Position): boolean {
        throw new Error("Method not implemented.");
    }
    public isEqual(other: vscode.Position): boolean {
        throw new Error("Method not implemented.");
    }
    public compareTo(other: vscode.Position): number {
        throw new Error("Method not implemented.");
    }
    public translate(lineDelta?: number, characterDelta?: number): vscode.Position;
    public translate(change: { lineDelta?: number; characterDelta?: number; }): vscode.Position;
    public translate(lineDelta?: any, characterDelta?: any): any {
        throw new Error("Method not implemented.");
    }
    public with(line?: number, character?: number): vscode.Position;
    public with(change: { line?: number; character?: number; }): vscode.Position;
    public with(line?: any, character?: any): any {
        throw new Error("Method not implemented.");
    }

}

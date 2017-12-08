import * as vscode from "vscode";
import MockPosition from "./MockPosition";

export default class MockSelection implements vscode.Selection {
    public anchor: vscode.Position;
    public active: vscode.Position;
    public isReversed: boolean;
    public start: vscode.Position;
    public end: vscode.Position;
    public isEmpty: boolean;
    public isSingleLine: boolean;

    public constructor(a: MockPosition) {
        this.active = a;
        this.start = a;
    }

    public contains(positionOrRange: vscode.Range | vscode.Position): boolean {
        throw new Error("Method not implemented.");
    }
    public isEqual(other: vscode.Range): boolean {
        throw new Error("Method not implemented.");
    }
    public intersection(range: vscode.Range): vscode.Range {
        throw new Error("Method not implemented.");
    }
    public union(other: vscode.Range): vscode.Range {
        throw new Error("Method not implemented.");
    }
    public with(start?: vscode.Position, end?: vscode.Position): vscode.Range;
    public with(change: { start?: vscode.Position; end?: vscode.Position; }): vscode.Range;
    public with(start?: any, end?: any): any {
        throw new Error("Method not implemented.");
    }
}

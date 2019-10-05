"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as opn from "opn";
import * as vscode from "vscode";
import CodeParserController from "./CodeParserController";

enum AlignmentNotificationOptions {
    CHANGED = "Show me how to do that",
    HIDE = "Don't show me again",
    GLOBAL_STORAGE_KEY = "doxdocgen_hide_alignment_notification",
}

enum Version {
    CURRENT = "0.5.1",
    PREVIOUS = "0.5.0",
    KEY = "doxdocgen_version",
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const parser = new CodeParserController();

    context.subscriptions.push(parser);

    const version = context.globalState.get<string>(Version.KEY);
    if (version === undefined) {
        context.globalState.update(Version.KEY, Version.CURRENT);
    } else if (version !== Version.CURRENT) {
        context.globalState.update(Version.KEY, Version.CURRENT);
    }
}

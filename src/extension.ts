"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import CodeParserController from "./CodeParserController";
import DoxygenCompletionItemProvider from "./DoxygenCompletionItemProvider";

enum Version {
    CURRENT = "1.3.0",
    PREVIOUS = "1.2.2",
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

    /*register doxygen commands intellisense */
    if (vscode.workspace.getConfiguration("doxdocgen.generic").get<boolean>("commandSuggestion")) {
        // tslint:disable-next-line: max-line-length
        vscode.languages.registerCompletionItemProvider({ language: "cpp", scheme: "file" }, new DoxygenCompletionItemProvider(), "@", "\\");
    }

    // After the CompletionItemProvider is registered, it cannot be unregistered
    // Check the settings everytime when it is triggered would be inefficient
    // So just prompt the user to restart to take effect
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("doxdocgen.generic.commandSuggestion")) {
            vscode.window.showWarningMessage("Please restart vscode to apply the changes!");
        }
    });
}

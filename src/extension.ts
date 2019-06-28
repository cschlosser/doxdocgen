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
    CURRENT = "0.5.0",
    PREVIOUS = "0.4.3",
    KEY = "doxdocgen_version",
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const parser = new CodeParserController();

    context.subscriptions.push(parser);

    let change: boolean = false;
    const version = context.globalState.get<string>(Version.KEY);
    if (version === undefined) {
        context.globalState.update(Version.KEY, Version.CURRENT);
    } else if (version !== Version.CURRENT) {
        if (parseInt(version.split(".")[1], 10) < 5) {
            change = true;
        }
        context.globalState.update(Version.KEY, Version.CURRENT);
    }
    let notificationHideThenable: Thenable<string>;
    const active = context.globalState.get<string>(AlignmentNotificationOptions.GLOBAL_STORAGE_KEY);
    if (change && (active === undefined || active !== "false")) {
        // tslint:disable-next-line:max-line-length
        notificationHideThenable =
            vscode.window.showWarningMessage("DoxDocGen: I can now align your comments",
                                             AlignmentNotificationOptions.CHANGED,
                                             AlignmentNotificationOptions.HIDE);
    }

    if (notificationHideThenable !== undefined) {
        notificationHideThenable.then((action) => {
            if (action === AlignmentNotificationOptions.CHANGED) {
                // tslint:disable-next-line:max-line-length
                opn("https://github.com/christophschlosser/doxdocgen/blob/master/CHANGELOG.md#alignment");
            } else if (action === AlignmentNotificationOptions.HIDE) {
                context.globalState.update(AlignmentNotificationOptions.GLOBAL_STORAGE_KEY, "false");
            }
        });
    }

}

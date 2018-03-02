"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as opn from "opn";
import * as vscode from "vscode";
import CodeParserController from "./CodeParserController";

enum ConfigChangedNotificationOptions {
    CHANGED = "What's changed",
    HIDE = "Don't show me again",
    GLOBAL_STORAGE_KEY = "doxdocgen_hide_config_changed_notification",
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const parser = new CodeParserController();

    context.subscriptions.push(parser);

    let notificationHideThenable: Thenable<string>;
    const active = context.globalState.get<string>(ConfigChangedNotificationOptions.GLOBAL_STORAGE_KEY);
    if (active === undefined || active !== "false") {
        // tslint:disable-next-line:max-line-length
        notificationHideThenable = vscode.window.showWarningMessage("DoxDocGen: Config keys have changed. Please check your config!", ConfigChangedNotificationOptions.CHANGED, ConfigChangedNotificationOptions.HIDE);
    }

    if (notificationHideThenable !== undefined) {
        notificationHideThenable.then((action) => {
            if (action === ConfigChangedNotificationOptions.CHANGED) {
                // tslint:disable-next-line:max-line-length
                opn("https://github.com/christophschlosser/doxdocgen/commit/1c844758719d8dc7d538585bb4393565e5629e84#diff-b9cfc7f2cdf78a7f4b91a753d10865a2");
            } else if (action === ConfigChangedNotificationOptions.HIDE) {
                context.globalState.update(ConfigChangedNotificationOptions.GLOBAL_STORAGE_KEY, "false");
            }
        });
    }
}

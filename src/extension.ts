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

enum Version {
    CURRENT = "0.4.0",
    PREVIOUS = "0.3.3",
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
        change = true;
        context.globalState.update(Version.KEY, Version.CURRENT);
    }

    let notificationHideThenable: Thenable<string>;
    const active = context.globalState.get<string>(ConfigChangedNotificationOptions.GLOBAL_STORAGE_KEY);
    if (change && (active === undefined || active !== "false")) {
        // tslint:disable-next-line:max-line-length
        notificationHideThenable = vscode.window.showWarningMessage("DoxDocGen: Config keys have changed. Please check your config!", ConfigChangedNotificationOptions.CHANGED, ConfigChangedNotificationOptions.HIDE);
    }

    if (notificationHideThenable !== undefined) {
        notificationHideThenable.then((action) => {
            if (action === ConfigChangedNotificationOptions.CHANGED) {
                // tslint:disable-next-line:max-line-length
                opn("https://github.com/christophschlosser/doxdocgen/blob/0.3.0/CHANGELOG.md#config-update");
            } else if (action === ConfigChangedNotificationOptions.HIDE) {
                context.globalState.update(ConfigChangedNotificationOptions.GLOBAL_STORAGE_KEY, "false");
            }
        });
    }
}

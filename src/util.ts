import * as env from "env-var";
import * as vscode from "vscode";

/**
 * Check if a specific line will be inside a comment block if comment block is inserted,
 * that is a line before the active line
 * @param activeEditor the active editor
 * @param activeLine the !previous! line to be checked
 */
export function inComment(activeEditor: vscode.TextEditor, activeLine: number): boolean {
    if (activeLine === 0) {
        return false;
    }

    const txt: string = activeEditor.document.lineAt(activeLine - 1).text.trim();
    if (!txt.startsWith("///") && !txt.startsWith("*") &&
        !txt.startsWith("/**") && !txt.startsWith("/*!")) {
        return false;
    } else {
        return true;
    }
}

/**
 * Get the indentation string for the current line (line at the current cursor position)
 */
export function getIndentation(editor: vscode.TextEditor = vscode.window.activeTextEditor): string {
    return editor.document.lineAt(editor.selection.start.line).text.match("^\\s*")[0];
}

/**
 * Expand environment variables in the string
 * @param replace string containing environment variables
 * @returns new string with expanded environment variables
 */
export function getEnvVars(replace: string): string {
    let replacement = replace;
    const regex = /\$\{env\:([\w|\d|_]+)\}/m;
    let match: RegExpExecArray;

    // tslint:disable-next-line:no-conditional-assignment
    while ((match = regex.exec(replacement)) !== null) {
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        const m = match[1];

        const envVar: string = env.get(m, m).asString();

        replacement = replacement.replace("${env:" + m + "}", envVar);
    }

    return replacement;
}

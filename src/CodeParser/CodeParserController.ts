import { Disposable, Position, TextDocumentContentChangeEvent, TextEditor, TextLine, window, workspace } from "vscode";
import CodeParser from "./CodeParser";
import CppParser from "./CppParser";

/**
 *
 * Checks if the event matches the specified guidelines and if a parser exists for this language
 *
 * @export
 * @class CodeParserController
 */
export default class CodeParserController {
    private disposable: Disposable;
    private indicators: string[] = [];

    /**
     * Creates an instance of CodeParserController
     *
     * @memberOf CodeParserController
     */
    public constructor() {
        const subscriptions: Disposable[] = [];

        this.readConfig();

        // Hand off the event to the parser if a valid parser is found
        workspace.onDidChangeTextDocument((event) => {
            const activeEditor: TextEditor = window.activeTextEditor;
            if (activeEditor && event.document === activeEditor.document) {
                this.onEvent(activeEditor, event.contentChanges[0]);
            }
        }, this, subscriptions);

        this.disposable = Disposable.from(...subscriptions);
    }

    /**
     *
     * Disposes of the subscriptions
     *
     * @memberOf CodeParserController
     */
    public dispose() {
        this.disposable.dispose();
    }

    /***************************************************************************
                                    Implementation
     ***************************************************************************/

    private readConfig() {
        this.indicators.push("/**"); // TODO: make this customizable
    }

    private check(activeEditor: TextEditor, event: TextDocumentContentChangeEvent): boolean {
        if (activeEditor == null || event.text == null) {
            return false;
        }
        const activeSelection: Position = activeEditor.selection.active;
        const activeLine: TextLine = activeEditor.document.lineAt(activeSelection.line);
        const activeChar: string = activeLine.text.charAt(activeSelection.character);
        const startsWith: boolean = event.text.startsWith("\n") || event.text.startsWith("\r\n");

        // Check if enter was pressed. Note the !
        if (!((activeChar === "") && startsWith)) {
            return false;
        }

        const cont: string = activeLine.text.trim();
        let found: boolean = false;

        this.indicators.forEach((element: string) => {
            if (element === cont) { // Compare the content from the line with the valid indicators
                found = true;
                return;
            }
        });

        return found;
    }

    private onEvent(activeEditor: TextEditor, event: TextDocumentContentChangeEvent) {
        if (!this.check(activeEditor, event)) {
            return null;
        }

        const lang: string = activeEditor.document.languageId;
        let parser: CodeParser;

        switch (lang) {
            case "cpp":
                parser = new CppParser();
                break;
            default:
                // tslint:disable-next-line:no-console
                console.log("No comments can be generated for language: " + lang);
                return null;
        }
        parser.Parse(activeEditor, event).GenerateDoc();
    }
}

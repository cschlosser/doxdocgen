import {
    Disposable,
    Position,
    Range,
    TextDocumentContentChangeEvent,
    TextEditor,
    TextLine,
    window,
    workspace,
} from "vscode";
import { Config, ConfigType } from "../Config";
import CodeParser from "./CodeParser";
import CParser from "./CParser/CParser";
import CppParser from "./CParser/CppParser";

/**
 *
 * Checks if the event matches the specified guidelines and if a parser exists for this language
 *
 * @export
 * @class CodeParserController
 */
export default class CodeParserController {
    private disposable: Disposable;
    private triggerSequence: string;

    /**
     * Creates an instance of CodeParserController
     *
     * @memberOf CodeParserController
     */
    public constructor() {
        const subscriptions: Disposable[] = [];

        // Hand off the event to the parser if a valid parser is found
        workspace.onDidChangeTextDocument((event) => {
            const activeEditor: TextEditor = window.activeTextEditor;
            if (activeEditor && event.document === activeEditor.document) {
                this.readConfig();

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
        this.triggerSequence = workspace
            .getConfiguration(ConfigType.generic)
            .get<string>(Config.triggerSequence, "/**");
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

        return this.triggerSequence === cont;
    }

    private onEvent(activeEditor: TextEditor, event: TextDocumentContentChangeEvent) {
        if (!this.check(activeEditor, event)) {
            return null;
        }

        const lang: string = activeEditor.document.languageId;
        let parser: CodeParser;

        switch (lang) {
            case "c":
                parser = new CParser();
                break;
            case "cpp":
                parser = new CppParser();
                break;
            default:
                // tslint:disable-next-line:no-console
                console.log("No comments can be generated for language: " + lang);
                return null;
        }

        const currentPos: Position = window.activeTextEditor.selection.active;
        const startReplace: Position = new Position(
            currentPos.line,
            currentPos.character - this.triggerSequence.length,
        );

        let endReplace: Position = new Position(currentPos.line, currentPos.character);
        const nextLineText: string = window.activeTextEditor.document.lineAt(endReplace.line + 1).text;
        // VSCode may enter a * on itself, we don't want that in our comment.
        if (nextLineText.trim() === "*") {
            endReplace = new Position(currentPos.line + 1, nextLineText.length);
        }

        parser.Parse(activeEditor, event).GenerateDoc(new Range(startReplace, endReplace));
    }
}

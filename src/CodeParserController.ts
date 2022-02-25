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
import CodeParser from "./Common/ICodeParser";
import { Config } from "./Config";
import GitConfig from "./GitConfig";
import CppParser from "./Lang/Cpp/CppParser";
import { inComment } from "./util";
/**
 *
 * Checks if the event matches the specified guidelines and if a parser exists for this language
 *
 * @export
 * @class CodeParserController
 */
export default class CodeParserController {
    private disposable: Disposable;
    private cfg: Config;
    private gitConfig: GitConfig;

    /**
     * Creates an instance of CodeParserController
     *
     * @memberOf CodeParserController
     */
    public constructor() {
        const subscriptions: Disposable[] = [];
        this.gitConfig = new GitConfig();

        // Hand off the event to the parser if a valid parser is found
        workspace.onDidChangeTextDocument((event) => {
            const activeEditor: TextEditor = window.activeTextEditor;
            if (activeEditor && event.document === activeEditor.document) {
                this.cfg = Config.ImportFromSettings();
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

    private check(activeEditor: TextEditor, event: TextDocumentContentChangeEvent): boolean {
        if (activeEditor === undefined || activeEditor == null ||
            event === undefined || event.text == null) {
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

        // Check if currently in a comment block
        if (inComment(activeEditor, activeSelection.line)) {
            return false;
        }

        // Do not trigger when there's whitespace after the trigger sequence
        // tslint:disable-next-line:max-line-length
        const seq = "[\\s]*(" + this.cfg.C.triggerSequence.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ")$";
        const match: RegExpMatchArray = activeLine.text.match(seq);

        if (match !== null) {
            const cont: string = match[1];
            return this.cfg.C.triggerSequence === cont;
        } else {
            return false;
        }
    }

    private onEvent(activeEditor: TextEditor, event: TextDocumentContentChangeEvent) {
        if (!this.check(activeEditor, event)) {
            return null;
        }

        const lang: string = activeEditor.document.languageId;
        let parser: CodeParser;

        switch (lang) {
            case "c":
            case "cpp":
            case "cuda":
            case "cuda-cpp":
                parser = new CppParser(this.cfg);
                break;
            default:
                // tslint:disable-next-line:no-console
                console.log("No comments can be generated for language: " + lang);
                return null;
        }

        const currentPos: Position = window.activeTextEditor.selection.active;
        const startReplace: Position = new Position(
            currentPos.line,
            currentPos.character - this.cfg.C.triggerSequence.length,
        );

        const nextLineText: string = window.activeTextEditor.document.lineAt(startReplace.line + 1).text;
        const endReplace = new Position(currentPos.line + 1, nextLineText.length);

        parser.Parse(activeEditor).GenerateDoc(new Range(startReplace, endReplace), this.gitConfig);
    }
}

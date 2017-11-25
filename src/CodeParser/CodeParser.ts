import { Position, TextDocumentContentChangeEvent, TextEditor } from "vscode";

export default interface ICodeParser {

    /**
     * @param  {TextEditor} activeEditor The open active Editor where the event came from
     */
    Parse(activeEditor: TextEditor);
}

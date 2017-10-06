import { Position, TextDocumentContentChangeEvent, TextEditor } from "vscode";

export default interface ICodeParser {

    /**
     * @param  {TextEditor} activeEditor The open active Editor where the event came from
     * @param  {TextDocumentContentChangeEvent} event Something in the document changed
     */
    Parse(activeEditor: TextEditor, event: TextDocumentContentChangeEvent);
}

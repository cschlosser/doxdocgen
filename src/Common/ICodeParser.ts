import { TextEditor } from "vscode";
import { IDocGen } from "./IDocGen";

export default interface ICodeParser {
    /**
     * @param  {TextEditor} activeEditor The open active Editor where the event came from
     */
    Parse(activeEditor: TextEditor): IDocGen;
}

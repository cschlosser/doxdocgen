import { Position, TextDocumentContentChangeEvent, TextEditor, TextLine } from "vscode";
import Generator from "../../DocGen/CGen";
import { IDocGen } from "../../DocGen/DocGen";
import CParser from "./CParser";

/**
 *
 * Parses C++ code for methods and signatures
 *
 * @export
 * @class CppParser
 * @implements {ICodeParser}
 */
export default class CppParser extends CParser {
    // For now C++ is the same as C
}

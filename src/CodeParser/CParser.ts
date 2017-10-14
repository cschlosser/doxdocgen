import { Position, TextDocumentContentChangeEvent, TextEditor, TextLine, workspace } from "vscode";
import { Config, ConfigType } from "../Config";
import Generator from "../DocGen/CGen";
import { IDocGen } from "../DocGen/DocGen";
import ICodeParser from "./CodeParser";

/**
 *
 * Parses C code for methods and signatures
 *
 * @export
 * @class CParser
 * @implements {ICodeParser}
 */
export default class CParser implements ICodeParser {
    protected activeEditor: TextEditor;
    protected activeSelection: Position;

    /**
     * @inheritdoc
     */
    public Parse(activeEdit: TextEditor, event: TextDocumentContentChangeEvent): IDocGen {
        this.activeEditor = activeEdit;
        this.activeSelection = this.activeEditor.selection.active;

        const activeLine: TextLine = this.activeEditor.document.lineAt(this.activeEditor.selection.active.line);

        const method: string = this.getMethodText();

        // Not a method
        if (method.length === 0) {
            return null;
        }

        const returnValue: string[] = this.getReturn(method);

        const params: string[] = this.getParams(method);

        const cppGenerator: IDocGen = new Generator(this.activeEditor, this.activeSelection, params, returnValue);
        return cppGenerator;
    }

    /***************************************************************************
                                    Implementation
     ***************************************************************************/

    protected getMethodText(): string {
        let method: string = "";

        let nextLine: Position = new Position(this.activeSelection.line + 1, this.activeSelection.character);

        let nextLineTxt: string = this.activeEditor.document.lineAt(nextLine.line).text.trim();

        // VSCode may enter a * on itself, we don't want that in our method
        if (nextLineTxt === "*") {
            nextLineTxt = "";
        }

        while (nextLineTxt.length === 0) { // Get first method line
            nextLine = new Position(nextLine.line + 1, nextLine.character);
            nextLineTxt = this.activeEditor.document.lineAt(nextLine.line).text.trim();
        }

        method += nextLineTxt;

        // Get method end line
        while (nextLineTxt.indexOf(")") === -1 &&
                (nextLineTxt.indexOf(";") === -1 || nextLineTxt.indexOf("}") === -1)) { // Check for method end
            nextLine = new Position(nextLine.line + 1, nextLine.character);
            nextLineTxt = this.activeEditor.document.lineAt(nextLine.line).text.trim();

            method += " " + nextLineTxt;
        }

        // Not a method but some code in the file
        if (method.indexOf(")") === -1) {
            return "";
        }

        return method;
    }

    protected getReturn(method: string): string[] {
        const retVals: string[] = [];

        // Remove the compiler keywords from the signature
        const sign: string = method.replace(/(static)|(inline)|(friend)|(virtual)|(extern)|(explicit)/g, "");
        // Remove the parameters from the signature
        const returnSignature = sign.slice(0, sign.indexOf("(")).trim();

        if (returnSignature.indexOf(" ") === -1) { // Constructor or similar
            return retVals;
        }

        const returnType: string = returnSignature.substr(0, returnSignature.lastIndexOf(" "));

        switch (returnType) {
            case "bool":
                retVals.push("true");
                retVals.push("false");
                break;
            case "void":
                break;
            default:
                retVals.push(returnType);
                break;
        }

        // Don't generate return type if the user doesn't wish to do it
        if (!workspace.getConfiguration(ConfigType.generic).get<boolean>(Config.generateReturnType, true) &&
            retVals.length > 0) {
            retVals.length = 0;
            retVals.push(" ");
            return retVals;
        }

        return retVals;
    }

    protected getParams(method: string): string[] {
        const params: string[] = [];

        // Get parameters from enclosing brackets
        const parameters: string = method.slice(method.indexOf("(")) // Get opening bracket
                                         .slice(1, method.indexOf(")")) // Remove opening bracket
                                         .split(")")[0]; // Get closing bracket

        if (parameters.length === 0) { // No parameters
            return params;
        }

        let paramArr: string[] = parameters.split(",");
        paramArr = paramArr.map((item: string) => {
            // Remove any special C++ characters
            const clean: string = item.trim().replace(/[&*\[\]]/g, "");

            return clean.split(" ").pop();
        });

        return paramArr;
    }
}

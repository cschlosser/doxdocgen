//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import CodeParser from "../CodeParser/CodeParser";
import CParser from "../CodeParser/CParser/CParser";
import { IDocGen } from "../DocGen/DocGen";
import * as myExtension from "../extension";
import MockDocument from "./MockDocument";
import MockEditor from "./MockEditor";
import MockLine from "./MockLine";
import MockPosition from "./MockPosition";
import MockSelection from "./MockSelection";

// Defines a Mocha test suite to group tests of similar kind together
suite("Comment parsing", () => {

    function setup(method: string): IDocGen {
        let parser: CodeParser;
        parser = new CParser();

        let position: MockPosition;
        position = new MockPosition(0, 0);

        let selection: MockSelection;
        selection = new MockSelection(position);

        let line: MockLine;
        line = new MockLine(method);

        let doc: MockDocument;
        doc = new MockDocument(line);

        let editor: vscode.TextEditor;
        editor = new MockEditor(selection, doc);

        const gen: IDocGen = parser.Parse(editor);

        return gen;
    }

    // Tests
});

// Defines a Mocha test suite to group tests of similar kind together
suite("Comment generation", () => {

    let editor: MockEditor;

    function setup(method: string): IDocGen {
        let parser: CodeParser;
        parser = new CParser();

        let position: MockPosition;
        position = new MockPosition(0, 0);

        let selection: MockSelection;
        selection = new MockSelection(position);

        let line: MockLine;
        line = new MockLine(method);

        let doc: MockDocument;
        doc = new MockDocument(line);

        editor = new MockEditor(selection, doc);

        const gen: IDocGen = parser.Parse(editor);

        return gen;
    }

    // Tests
    test("void main(int argc, char **argv)", () => {
        const gen: IDocGen = setup("void main(int argc, char **argv)");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @param argc \n * @param argv \n */", editor.editBuilder.text);
    });

    test("bool fuzzy_equal(const matrix<T, M, N>& mat, T fuzz) const", () => {
        const gen: IDocGen = setup("bool fuzzy_equal(const matrix<T, M, N>& mat, T fuzz) const");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @param mat \n * @param fuzz \n * @return true \n * @return false \n */",
                    editor.editBuilder.text);
    });
});

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

    test("int main()", () => {
        const gen: IDocGen = setup("int main()");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @return int \n */",
                    editor.editBuilder.text);
    });

    test("void foo(std::string str, std::vector<std::string> lst)", () => {
        const gen: IDocGen = setup("void foo(std::string str, std::vector<std::string> lst)");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @param str \n * @param lst \n */",
                    editor.editBuilder.text);
    });

    test("std::vector<int> foo()", () => {
        const gen: IDocGen = setup("std::vector<int> foo()");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @return std::vector<int> \n */",
                    editor.editBuilder.text);
    });

    test("myClass(int i)", () => {
        const gen: IDocGen = setup("myClass(int i)");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @param i \n */",
                    editor.editBuilder.text);
    });

    test("myClass(int i) : i(i)", () => {
        const gen: IDocGen = setup("myClass(int i) : i(i)");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @param i \n */",
                    editor.editBuilder.text);
    });

    test("virtual ~myClass()", () => {
        const gen: IDocGen = setup("virtual ~myClass()");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n */",
                    editor.editBuilder.text);
    });

    test("static inline unsigned int rewind_tospace(const unsigned char* chunk, unsigned int len)", () => {
        // tslint:disable-next-line:max-line-length
        const gen: IDocGen = setup("static inline unsigned int rewind_tospace(const unsigned char* chunk, unsigned int len)");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @param chunk \n * @param len \n * @return unsigned int \n */",
                    editor.editBuilder.text);
    });

    test("void foo_bar(void (*my_function_pointer) (unsigned int arg1, char arg2))", () => {
        const gen: IDocGen = setup("void foo_bar(void (*my_function_pointer) (unsigned int arg1, char arg2))");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @param my_function_pointer \n */",
                    editor.editBuilder.text);
    });

    test("int (*idputs(int (*puts)(const char *)))(const char *)", () => {
        const gen: IDocGen = setup("int (*idputs(int (*puts)(const char *)))(const char *)");

        gen.GenerateDoc(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)));

        assert.equal("/**\n * @brief \n * \n * @param puts \n * @return int(*)(const char*) \n */",
                    editor.editBuilder.text);
    });
});

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import TestSetup from "./TestSetup";

// Defines a Mocha test suite to group tests of similar kind together
suite("C++ - Preprocessor Tests", () => {
    const testSetup: TestSetup = new TestSetup("#define MY_MACRO 1");

    // Tests
    test("Macro", () => {
        const result = testSetup.GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    // Tests
    test("Macro with comment afterwards", () => {
        const result = testSetup.SetLines([
            "#define MY_MACRO 1",
            "/**",
            " */",
        ]).GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    // These two tests don't seem to belong here but the behavior they're testing only is reproducable
    // for macros otherwise
    test("detect auto generated closing */", () => {
        const result = testSetup.SetLines([
            "*/", // simulate an auto generated closing block comment
            "void foo(int bar);",
        ]).GetResult();
        assert.equal("/**\n * @brief \n * \n * @param bar \n */", result);
    });

    test("don't detect closing */", () => {
        const result = testSetup.SetLines([
            "/*",
            " */",
            "void foo(int bar);",
        ]).GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });
});

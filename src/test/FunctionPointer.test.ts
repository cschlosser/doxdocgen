//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import TestSetup from "./tools/TestSetup";

// Defines a Mocha test suite to group tests of similar kind together
suite("Function pointer Tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");

    // Tests
    test("function pointer return", () => {
        const result = testSetup.SetLine("int (*idputs(int a, int b))(char *);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param a \n * @param b \n * @return int(*)(char*) \n */", result);
    });

    test("nested function pointer return", () => {
        const result = testSetup.SetLine("int (*(*(*foo(int a, int b))(int))(double))(float);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param a \n * @param b \n"
            + " * @return int(*(*(*)(int))(double))(float) \n */", result);
    });

    test("function pointer parameter", () => {
        const result = testSetup.SetLine("int foo(int (*puts)(const char *));").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param puts \n * @return int \n */", result);
    });

    test("struct function pointer return with struct FP parameters and keywords", () => {
        const result = testSetup.SetLine("const struct foo (*idputs(int (*puts)(const char *), const"
            + " struct test(*str)(int *, const struct test(*str2))))(const char *);").GetResult();

        assert.equal("/**\n * @brief \n * \n * @param puts \n * @param str "
            + "\n * @return const struct foo(*)(const char*) \n */", result);
    });
});

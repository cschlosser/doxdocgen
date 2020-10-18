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
suite("C++ - Function pointer Tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");

    // Tests
    test("Function pointer return", () => {
        const result = testSetup.SetLine("int (*idputs(int a, int b))(char *);").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return int(*)(char*) \n */", result);
    });

    test("Nested function pointer return", () => {
        const result = testSetup.SetLine("int (*(*(*foo(int a, int b))(int))(double))(float);").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n"
            + " * @return int(*(*(*)(int))(double))(float) \n */", result);
    });

    test("Function pointer parameter", () => {
        const result = testSetup.SetLine("int foo(int (*puts)(const char *));").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param puts \n * @return int \n */", result);
    });

    test("Struct function pointer return with struct FP parameters and keywords", () => {
        const result = testSetup.SetLine("const struct foo (*idputs(int (*puts)(const char *), const"
            + " struct test(*str)(int *, const struct test(*str2))))(const char *);").GetResult();

        assert.strictEqual("/**\n * @brief \n * \n * @param puts \n * @param str "
            + "\n * @return const struct foo(*)(const char*) \n */", result);
    });

    test("Memberpointer in function pointer", () => {
        const result = testSetup.SetLine("void foo(void (SomeClass::* func)());").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param func \n */", result);
    });

    test("Arraypointer", () => {
        const result = testSetup.SetLine("void some_function(int (*table)[]);").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param table \n */", result);
    });
});

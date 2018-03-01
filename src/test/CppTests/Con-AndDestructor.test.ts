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
suite("C++ - Con- and Destructor Tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");

    testSetup.cfg.generateSmartText = false;

    // Tests
    test("Normal Constructor", () => {
        const result = testSetup.SetLine("Foo(int a);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param a \n */", result);
    });

    test("Constructor with initializer list", () => {
        const result = testSetup.SetLine("Foo(int a) : m_a(a) {").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param a \n */", result);
    });

    test("Explicit Constructor", () => {
        const result = testSetup.SetLine("explicit Foo(int a);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param a \n */", result);
    });

    test("Deleted Constructor", () => {
        const result = testSetup.SetLine("Foo(int a) = delete;").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param a \n */", result);
    });

    test("Default Constructor", () => {
        const result = testSetup.SetLine("Foo() = default;").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    test("Destructor", () => {
        const result = testSetup.SetLine("~Foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    test("Virtual Destructor", () => {
        const result = testSetup.SetLine("virtual ~Foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    test("Deleted Destructor", () => {
        const result = testSetup.SetLine("virtual ~Foo() = 0").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    test("Default Destructor", () => {
        const result = testSetup.SetLine("~Foo() = default;").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });
});

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
suite("C++ - Trailing returns tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");

    // tests
    test("Trailing return", () => {
        const result = testSetup.SetLine("auto foo() -> int;").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @return int \n */", result);
    });

    test("Trailing return with decltype", () => {
        const result = testSetup.SetLine("auto foo(int a, double b) -> decltype(a + b);").GetResult();
        // tslint:disable-next-line: max-line-length
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return decltype(a + b) \n */", result);
    });

    test("Multiple trailing returns", () => {
        const result = testSetup.SetLine("auto foo() -> auto(*)() -> tmp<int>(*)();").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @return auto(*)() -> tmp<int>(*)() \n */", result);
    });

    test("Trailing return with keywords", () => {
        const result = testSetup.SetLine("auto foo(const int& a, const double* b) const noexcept -> const double&;")
            .GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return const double& \n */", result);
    });
});

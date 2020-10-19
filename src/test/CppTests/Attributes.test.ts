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
suite("C++ - Attributes Tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");

    // Tests
    test("Attributes on parameter", () => {
        const result = testSetup.SetLine("int foo([[maybe_unused]] int a, [[maybe_unused]]double& b);").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return int \n */", result);
    });

    test("Attributes on function", () => {
        const result = testSetup.SetLine("[[nodiscard]] int foo(int a, double& b);").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return int \n */", result);
    });

    test("Multiple attributes on parameter", () => {
        const result = testSetup.SetLine("int foo([[maybe_unused]] [[carries_dependency]]"
            + " int a, double& b);").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return int \n */", result);
    });

    test("Multiple attributes on function", () => {
        const result = testSetup.SetLine("[[nodiscard]][[deprecated(\"old\")]] int foo(int a, double& b);").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return int \n */", result);
    });

    test("Specifier and attribute on class", () => {
        const result = testSetup.SetLine("class [[nodiscard]] alignas(8) Matrix {").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n */", result);
    });

    test("Specifier and attribute on struct", () => {
        const result = testSetup.SetLine("struct [[nodiscard]] alignas(8) Matrix {").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n */", result);
    });

    test("Noexcept on function", () => {
        let result = testSetup.SetLine("constexpr int foo(int a, double& b) noexcept(true);").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return constexpr int \n */", result);

        result = testSetup.SetLine("constexpr int foo(int a, double& b) noexcept;").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return constexpr int \n */", result);
    });

    test("Throw on function", () => {
        const result = testSetup.SetLine("constexpr int foo(int a, double& b) throw(std::except);").GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param a \n * @param b \n * @return constexpr int \n */", result);
    });

    test("Newline in function", () => {
        const result = testSetup.SetLines(["static void ResetActionState( BOOL sendNAK )", "{"]).GetResult();
        assert.strictEqual("/**\n * @brief \n * \n * @param sendNAK \n */", result);
    });
});

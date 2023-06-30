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
suite("C++ - Return type Tests", () => {

    const testSetup: TestSetup = new TestSetup("void foo();");

    // Tests
    test("Void return", () => {
        const result = testSetup.SetLine("void foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n */");
    });

    test("Void pointer return", () => {
        const result = testSetup.SetLine("void* foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return void* \n */");
    });

    test("Reference return", () => {
        const result = testSetup.SetLine("int& foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return int& \n */");
    });

    test("Simple type return", () => {
        const result = testSetup.SetLine("int foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return int \n */");
    });

    test("Bool with retval", () => {
        testSetup.cfg.Generic.useBoolRetVal = true;
        const result = testSetup.SetLine("bool foo();").GetResult();
        testSetup.cfg.Generic.useBoolRetVal = false;
        assert.strictEqual(result, "/**\n * @brief \n * \n * @retval true \n * @retval false \n */");
    });

    test("Bool return type", () => {
        const result = testSetup.SetLine("bool foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return true \n * @return false \n */");
    });

    test("Pointer return type", () => {
        const result = testSetup.SetLine("int* foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return int* \n */");
    });

    test("Bool pointer return type", () => {
        const result = testSetup.SetLine("bool* foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return true \n * @return false \n */");
    });

    test("Struct pointer return type", () => {
        const result = testSetup.SetLine("struct foo* foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return struct foo* \n */");
    });

    test("Struct return type", () => {
        const result = testSetup.SetLine("struct Bar* foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return struct Bar* \n */");
    });

    test("Return type with keywords", () => {
        const result = testSetup.SetLine("static constexpr inline Bar* const foo() "
            + "const;").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return constexpr Bar* const \n */");
    });

    test("Return type struct with keywords", () => {
        const result = testSetup.SetLine("static constexpr inline struct Bar* foo() "
            + "const;").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return constexpr struct Bar* \n */");
    });

    test("Const with const pointer to const pointer return type", () => {
        let result = testSetup.SetLine("const int* const* const foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return const int* const* const \n */");

        result = testSetup.SetLine("int const* const* const foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return int const* const* const \n */");
    });

    test("Fundamental return type with modifiers", () => {
        let result = testSetup.SetLine("unsigned int foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return unsigned int \n */");

        result = testSetup.SetLine("unsigned short int foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return unsigned short int \n */");

        result = testSetup.SetLine("signed short foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return signed short \n */");

        result = testSetup.SetLine("long foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return long \n */");

        result = testSetup.SetLine("unsigned long long int foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return unsigned long long int \n */");

        result = testSetup.SetLine("signed foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return signed \n */");

        result = testSetup.SetLine("unsigned foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return unsigned \n */");

        result = testSetup.SetLine("unsigned char foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return unsigned char \n */");

        result = testSetup.SetLine("long double foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return long double \n */");

        result = testSetup.SetLine("long unsigned unsigned_foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return long unsigned \n */");
    });

    test("Function in namespace", () => {
        const result = testSetup.SetLine("int MyClass::foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return int \n */");
    });

    test("Return Type in namespace", () => {
        const result = testSetup.SetLine("MyNamespace::Foo MakeFoo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return MyNamespace::Foo \n */");
    });

    test("Template return type", () => {
        const result = testSetup.SetLine("Matrix<A, B, C> foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return Matrix<A, B, C> \n */");
    });

    test("Template return type within templated namespace", () => {
        const result = testSetup.SetLine("Matrix<A, B, C>::Matrix<A, B, C> foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return Matrix<A, B, C>::Matrix<A, B, C> \n */");
    });

    test("Function in templated namespace", () => {
        const result = testSetup.SetLine("int Matrix<A, B, C>::foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return int \n */");
    });

    test("Function with nested namespacee", () => {
        const result = testSetup.SetLine("int Math::LA::Matrix<A, B, C>::foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return int \n */");
    });

    test("Return Type in nested namespace", () => {
        const result = testSetup.SetLine("Math::LA::Matrix<A, B, C> foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return Math::LA::Matrix<A, B, C> \n */");
    });
});

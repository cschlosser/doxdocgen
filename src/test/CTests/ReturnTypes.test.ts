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
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    test("Void pointer return", () => {
        const result = testSetup.SetLine("void* foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return void* \n */", result);
    });

    test("Reference return", () => {
        const result = testSetup.SetLine("int& foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int& \n */", result);
    });

    test("Simple type return", () => {
        const result = testSetup.SetLine("int foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);
    });

    test("Bool return type", () => {
        const result = testSetup.SetLine("bool foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return true \n * @return false \n */", result);
    });

    test("Pointer return type", () => {
        const result = testSetup.SetLine("int* foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int* \n */", result);
    });

    test("Bool pointer return type", () => {
        const result = testSetup.SetLine("bool* foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return true \n * @return false \n */", result);
    });

    test("Struct pointer return type", () => {
        const result = testSetup.SetLine("struct foo* foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return struct foo* \n */", result);
    });

    test("Struct return type", () => {
        const result = testSetup.SetLine("struct Bar* foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return struct Bar* \n */", result);
    });

    test("Return type with keywords and noexcept", () => {
        const result = testSetup.SetLine("static constexpr inline struct Bar* foo() "
            + "const noexcept(false);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return constexpr struct Bar* \n */", result);
    });

    test("Fundamental return type with modifiers", () => {
        let result = testSetup.SetLine("unsigned int foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned int \n */", result);

        result = testSetup.SetLine("unsigned short int foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned short int \n */", result);

        result = testSetup.SetLine("signed short foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return signed short \n */", result);

        result = testSetup.SetLine("long foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return long \n */", result);

        result = testSetup.SetLine("unsigned long long int foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned long long int \n */", result);

        result = testSetup.SetLine("signed foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return signed \n */", result);

        result = testSetup.SetLine("unsigned foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned \n */", result);

        result = testSetup.SetLine("unsigned char foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned char \n */", result);

        result = testSetup.SetLine("long double foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return long double \n */", result);
    });
});

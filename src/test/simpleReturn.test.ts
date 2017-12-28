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
suite("Arguments tests", () => {

    const testSetup: TestSetup = new TestSetup("void foo();");

    // Tests
    test("void return", () => {
        const result = testSetup.SetMethod("void foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    test("simple type return", () => {
        const result = testSetup.SetMethod("int foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);
    });

    test("bool return type", () => {
        const result = testSetup.SetMethod("bool foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return true \n * @return false \n */", result);
    });

    test("pointer return type", () => {
        const result = testSetup.SetMethod("int* foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int* \n */", result);
    });

    test("bool pointer return type", () => {
        const result = testSetup.SetMethod("bool* foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return true \n * @return false \n * @return null \n */", result);
    });

    test("Fundamental return type with modifiers", () => {
        let result = testSetup.SetMethod("unsigned int foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned int \n */", result);

        result = testSetup.SetMethod("unsigned short int foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned short int \n */", result);

        result = testSetup.SetMethod("signed short foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return signed short \n */", result);

        result = testSetup.SetMethod("long foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return long \n */", result);

        result = testSetup.SetMethod("unsigned long long int foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned long long int \n */", result);

        result = testSetup.SetMethod("signed foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return signed \n */", result);

        result = testSetup.SetMethod("unsigned foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned \n */", result);

        result = testSetup.SetMethod("unsigned char foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return unsigned char \n */", result);

        result = testSetup.SetMethod("long double foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return long double \n */", result);
    });

    test("struct return type", () => {
        const result = testSetup.SetMethod("struct my_struct foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return struct my_struct \n */", result);
    });

});

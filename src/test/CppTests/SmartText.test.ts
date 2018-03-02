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
suite("Smart Text Tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");

    // Tests
    test("Disable smart text Ctor", () => {
        testSetup.cfg.Generic.generateSmartText = false;
        const result = testSetup.SetLine("Foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    test("Disable smart text Dtor", () => {
        testSetup.cfg.Generic.generateSmartText = false;
        const result = testSetup.SetLine("~Foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
    });

    test("Disable smart text getter", () => {
        testSetup.cfg.Generic.generateSmartText = false;
        const result = testSetup.SetLine("int getFoo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);
    });

    test("Disable smart text setter", () => {
        testSetup.cfg.Generic.generateSmartText = false;
        const result = testSetup.SetLine("void setFoo(int foo);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param foo \n */", result);
    });

    test("Disable smart text factory method", () => {
        testSetup.cfg.Generic.generateSmartText = false;
        const result = testSetup.SetLine("int createFoo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);
    });

    test("Standard smart text Ctor", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("Foo();").GetResult();
        assert.equal("/**\n * @brief Construct a new Foo object\n * \n */", result);
    });

    test("Standard smart text Dtor", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("~Foo();").GetResult();
        assert.equal("/**\n * @brief Destroy the Foo object\n * \n */", result);
    });

    test("Standard smart text getter", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("int getFoo();").GetResult();
        assert.equal("/**\n * @brief Get the Foo object\n * \n * @return int \n */", result);
    });

    test("Standard smart text setter", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("void setFoo(int foo);").GetResult();
        assert.equal("/**\n * @brief Set the Foo object\n * \n * @param foo \n */", result);
    });

    test("Standard smart text factory method", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("int createFoo();").GetResult();
        assert.equal("/**\n * @brief Create a Foo object\n * \n * @return int \n */", result);
    });

    test("Casing text split: SCREAMING_SNAKE", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("int CREATE_FOO();").GetResult();
        assert.equal("/**\n * @brief Create a foo object\n * \n * @return int \n */", result);
    });

    test("Casing text split: snake_case", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("int create_foo();").GetResult();
        assert.equal("/**\n * @brief Create a foo object\n * \n * @return int \n */", result);
    });

    test("Casing text split: PascalCase", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("int CreateFoo();").GetResult();
        assert.equal("/**\n * @brief Create a Foo object\n * \n * @return int \n */", result);
    });

    test("Casing text split: camelCase", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("int createFoo();").GetResult();
        assert.equal("/**\n * @brief Create a Foo object\n * \n * @return int \n */", result);
    });

    test("Casing text split: UPPERCASE", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("int CREATEFOO();").GetResult();
        assert.equal("/**\n * @brief Create a FOO object\n * \n * @return int \n */", result);
    });

    test("Casing text split: UnCertain_CASE", () => {
        testSetup.cfg.Generic.generateSmartText = true;
        const result = testSetup.SetLine("int Create_FOO();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);
    });

    test("Casing text split: unidentifieable", () => {
        testSetup.cfg.Generic.generateSmartText = true;

        // SCREAMING_SNAKE
        let result = testSetup.SetLine("int CREATE_foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);

        // snake_case
        result = testSetup.SetLine("int create_FOO();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);

        // Pascal
        result = testSetup.SetLine("int Createfoo();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);

        // camel
        result = testSetup.SetLine("int createFOO();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);

        // UPPER???
        result = testSetup.SetLine("int CREATE_();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);
    });
});

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
        testSetup.cfg.generateSmartText = false;
        const result = testSetup.SetLine("Foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
        testSetup.cfg.generateSmartText = true; // for later tests
    });

    test("Disable smart text Dtor", () => {
        testSetup.cfg.generateSmartText = false;
        const result = testSetup.SetLine("~Foo();").GetResult();
        assert.equal("/**\n * @brief \n * \n */", result);
        testSetup.cfg.generateSmartText = true; // for later tests
    });

    test("Standard smart text Ctor", () => {
        const result = testSetup.SetLine("Foo();").GetResult();
        assert.equal("/**\n * @brief Construct a new Foo object\n * \n */", result);
    });

    test("Standard smart text Dtor", () => {
        const result = testSetup.SetLine("~Foo();").GetResult();
        assert.equal("/**\n * @brief Destroy the Foo object\n * \n */", result);
    });
});

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as moment from "moment";
import * as vscode from "vscode";
import TestSetup from "./TestSetup";

// Defines a Mocha test suite to group tests of similar kind together
suite("File Description Tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");
    const date = moment().format("YYYY-MM-DD");

    // Tests
    test("#include on next line", () => {
        const result = testSetup.SetLine("#include <iostream>").GetResult();
        assert.equal("/**\n * @brief \n * \n * @file MockDocument.h\n * @author your name\n" +
            " * @date " + date + "\n */", result);
    });

    test("On first line of document", () => {
        const result = testSetup.SetLine("").GetResult();
        assert.equal("/**\n * @brief \n * \n * @file MockDocument.h\n * @author your name\n" +
            " * @date " + date + "\n */", result);
    });

    test("Don't generate non existing commands", () => {
        testSetup.cfg.File.fileOrder = ["dates"];
        const result = testSetup.SetLine("").GetResult();
        assert.equal("/**\n */", result);
    });
});

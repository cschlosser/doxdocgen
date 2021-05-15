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
    testSetup.cfg.File.fileOrder = ["brief", "empty", "file", "author", "date"];
    const date = moment().format("YYYY-MM-DD");
    const year = moment().format("YYYY");

    // Tests
    test("#include on next line", () => {
        const result = testSetup.SetLine("#include <iostream>").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @file MockDocument.h\n * @author your name (you@domain.com)\n" +
            " * @date " + date + "\n */");
    });

    test("#pragma on next line", () => {
        const result = testSetup.SetLine("#pragma Foo").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @file MockDocument.h\n * @author your name (you@domain.com)\n" +
            " * @date " + date + "\n */");
    });

    test("On first line of document", () => {
        const result = testSetup.SetLine("").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @file MockDocument.h\n * @author your name (you@domain.com)\n" +
            " * @date " + date + "\n */");
    });

    test("File description in first line", () => {
        const result = testSetup.SetLines([
            "/**",
            "",
            "",
            "struct T {",
            "   int i;",
            "};",
            ], false).GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @file MockDocument.h\n * @author your name (you@domain.com)\n" +
            " * @date " + date + "\n */");
    });

    test("Don't generate non existing commands", () => {
        testSetup.cfg.File.fileOrder = ["dates"];
        const result = testSetup.SetLine("").GetResult();
        assert.strictEqual(result, "/**\n */");
    });

    test("version block", () => {
        testSetup.cfg.File.fileOrder = ["version"];
        const result = testSetup.SetLine("").GetResult();
        assert.strictEqual(result, "/**\n * @version 0.1\n */");
    });

    test("Copyright block", () => {
        testSetup.cfg.File.fileOrder = ["copyright"];
        const result = testSetup.SetLine("").GetResult();
        assert.strictEqual(result, "/**\n * @copyright Copyright (c) " + year + "\n */");
    });

    test("version block", () => {
        testSetup.cfg.File.fileOrder = ["version"];
        const result = testSetup.SetLine("").GetResult();
        assert.strictEqual(result, "/**\n * @version 0.1\n */");
    });

    test("custom block", () => {
        testSetup.cfg.File.fileOrder = ["custom"];
        testSetup.cfg.File.customTag = ["First Line", "{year} Year Line", "{date} Date Line",
                                        "{author} Author Line", "{email} Email Line", "{file} File Line"];
        const result = testSetup.SetLine("").GetResult();
        assert.strictEqual(result, "/**\n * First Line\n * " + year + " Year Line\n * " + date + " Date Line\n" +
            " * your name Author Line\n * you@domain.com Email Line\n" + " * MockDocument.h File Line\n */");
    });
});

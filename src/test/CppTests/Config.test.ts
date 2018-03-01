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
import { Config } from "../../Config";
import TestSetup from "./TestSetup";

// Defines a Mocha test suite to group tests of similar kind together
suite("C++ - Configuration Tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");

    // Tests
    test("Default config", () => {
        testSetup.cfg = new Config();
        const result = testSetup.SetLine("template<typename T> bool foo(T a);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @tparam T \n * @param a \n * "
            + "@return true \n * @return false \n */", result);
    });

    test("Modified template", () => {
        testSetup.cfg = new Config();

        testSetup.cfg.C.firstLine = "";
        testSetup.cfg.C.lastLine = "";
        testSetup.cfg.C.commentPrefix = "/// ";
        testSetup.cfg.Generic.briefTemplate = "\\brief ";
        testSetup.cfg.Generic.paramTemplate = "\\param {param} ";
        testSetup.cfg.Cpp.tparamTemplate = "\\tparam {param} ";
        testSetup.cfg.Generic.returnTemplate = "\\return {type} ";

        const result = testSetup.SetLine("template<typename T> bool foo(T a);").GetResult();
        assert.equal("/// \\brief \n/// \n/// \\tparam T \n/// \\param a \n"
            + "/// \\return true \n/// \\return false ", result);

    });

    test("Disable true false on bool", () => {
        testSetup.cfg = new Config();
        testSetup.cfg.Generic.boolReturnsTrueFalse = false;
        const result = testSetup.SetLine("template<typename T> bool foo(T a);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @tparam T \n * @param a \n"
            + " * @return bool \n */", result);
    });

    test("Disable including return type.", () => {
        testSetup.cfg = new Config();
        testSetup.cfg.Generic.includeTypeAtReturn = false;

        const result = testSetup.SetLine("template<typename T> bool foo(T a);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @tparam T \n * @param a \n"
            + " * @return  \n */", result);
    });

    test("Newlines after params and tparams but not after brief", () => {
        testSetup.cfg = new Config();
        testSetup.cfg.Generic.newLineAfterBrief = false;
        testSetup.cfg.Generic.newLineAfterParams = true;
        testSetup.cfg.Cpp.newLineAfterTParams = true;

        const result = testSetup.SetLine("template<typename T> bool foo(T a);").GetResult();
        assert.equal("/**\n * @brief \n * @tparam T \n * \n * @param a \n * \n"
            + " * @return true \n * @return false \n */", result);
    });

    test("Indentation test", () => {
        testSetup.cfg = new Config();
        let result = testSetup.SetLine("\ttemplate<typename T> bool foo(T a);").GetResult();
        assert.equal("/**\n\t * @brief \n\t * \n\t * @tparam T \n\t * @param a \n\t * "
            + "@return true \n\t * @return false \n\t */", result);

        result = testSetup.SetLine("          template<typename T> bool foo(T a);").GetResult();
        assert.equal("/**\n           * @brief \n           * \n           * @tparam T "
            + "\n           * @param a \n           * "
            + "@return true \n           * @return false \n           */", result);
    });

    test("Lines to get test", () => {
        testSetup.cfg = new Config();
        testSetup.cfg.Generic.linesToGet = 2;
        const positiveResult = testSetup.SetLines(["template<typename T> bool \n", "foo(T a);"]).GetResult();
        assert.equal("/**\n * @brief \n * \n * @tparam T \n * @param a \n * "
            + "@return true \n * @return false \n */", positiveResult);
        testSetup.cfg.Generic.linesToGet = 0;
        testSetup.firstLine = 1;
        const negativeResult = testSetup.SetLines(["template<typename T> bool \n", "foo(T a);"]).GetResult();
        assert.equal("/**\n * @brief \n * \n */", negativeResult);
    });

    test("File description order test", () => {
        testSetup.cfg = new Config();
        testSetup.firstLine = 0;
        testSetup.cfg.File.fileOrder = ["brief", "author", "date", "file"];
        const result = testSetup.SetLine("").GetResult();
        assert.equal("/**\n * @brief \n * \n * @author your name\n" +
            " * @date " + moment().format("YYYY-MM-DD") + "\n * @file MockDocument.h\n */", result);
    });

    test("Custom smart text Ctor", () => {
        testSetup.cfg.Cpp.ctorText = "Test {name}";
        const result = testSetup.SetLine("Foo();").GetResult();
        assert.equal("/**\n * @brief Test Foo\n * \n */", result);
    });

    test("Custom smart text Dtor", () => {
        testSetup.cfg.Cpp.dtorText = "Test {name}";
        const result = testSetup.SetLine("~Foo();").GetResult();
        assert.equal("/**\n * @brief Test Foo\n * \n */", result);
    });
});

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

    test("Comment order", () => {
        testSetup.cfg = new Config();
        testSetup.cfg.Generic.order = ["brief", "param", "tparam", "return"];
        const result = testSetup.SetLine("template<typename T> bool foo(T a);").GetResult();
        assert.equal("/**\n * @brief \n * @param a \n * @tparam T \n * "
            + "@return true \n * @return false \n */", result);
    });

    test("Non existing order param", () => {
        testSetup.cfg = new Config();
        testSetup.cfg.Generic.order = ["breif"];
        const result = testSetup.SetLine("template<typename T> bool foo(T a);").GetResult();
        assert.equal("/**\n */", result);
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
        testSetup.cfg.Generic.order = ["brief", "tparam", "empty", "param", "empty", "return"];

        const result = testSetup.SetLine("template<typename T> bool foo(T a);").GetResult();
        testSetup.cfg.Generic.order = ["brief", "empty", "tparam", "param", "return"]; // reset to default
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
        assert.equal("/**\n * @brief \n * @author your name (you@domain.com)\n" +
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

    test("Custom smart text getter", () => {
        testSetup.cfg.C.getterText = "Test {name}";
        const result = testSetup.SetLine("int getFoo();").GetResult();
        assert.equal("/**\n * @brief Test Foo\n * \n * @return int \n */", result);
    });

    test("Custom smart text setter", () => {
        testSetup.cfg.C.setterText = "Test {name}";
        const result = testSetup.SetLine("void setFoo(int foo);").GetResult();
        assert.equal("/**\n * @brief Test Foo\n * \n * @param foo \n */", result);
    });

    test("Custom smart text factory method", () => {
        testSetup.cfg.C.factoryMethodText = "Test {name}";
        const result = testSetup.SetLine("int createFoo();").GetResult();
        assert.equal("/**\n * @brief Test Foo\n * \n * @return int \n */", result);
    });

    test("Don't split casing for smart text", () => {
        testSetup.cfg.C.factoryMethodText = "Test {name}";
        testSetup.cfg.Generic.splitCasingSmartText = false;
        const result = testSetup.SetLine("int createFooObject();").GetResult();
        assert.equal("/**\n * @brief Test FooObject\n * \n * @return int \n */", result);
    });

    test("Remove inserted '*/' from line", () => {
        const result = testSetup.SetLines(["*/", "int foo();"]).GetResult();
        assert.equal("/**\n * @brief \n * \n * @return int \n */", result);
    });
});

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
suite("Operators Tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");

    // Tests
    test("+ operator", () => {
        const result = testSetup.SetLine("T operator +(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("- operator", () => {
        const result = testSetup.SetLine("T operator- (const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("* operator", () => {
        const result = testSetup.SetLine("T operator*(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("/ operator", () => {
        const result = testSetup.SetLine("T operator/(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("% operator", () => {
        const result = testSetup.SetLine("T operator%(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("^ operator", () => {
        const result = testSetup.SetLine("T operator^(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("& operator", () => {
        const result = testSetup.SetLine("T operator&(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("| operator", () => {
        const result = testSetup.SetLine("T operator|(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("~ operator", () => {
        const result = testSetup.SetLine("T operator~(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T \n */", result);
    });

    test("<< operator", () => {
        const result = testSetup.SetLine("T operator<<(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test(">> operator", () => {
        const result = testSetup.SetLine("T operator>>(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("! operator", () => {
        const result = testSetup.SetLine("bool operator!(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return true \n * @return false \n */", result);
    });

    test("&& operator", () => {
        const result = testSetup.SetLine("bool operator&&(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */", result);
    });

    test("|| operator", () => {
        const result = testSetup.SetLine("bool operator||(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */", result);
    });

    test("!= operator", () => {
        const result = testSetup.SetLine("bool operator!=(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */", result);
    });

    test("== operator", () => {
        const result = testSetup.SetLine("bool operator==(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */", result);
    });

    test("<= operator", () => {
        const result = testSetup.SetLine("bool operator<=(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */", result);
    });

    test(">= operator", () => {
        const result = testSetup.SetLine("bool operator>=(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */", result);
    });

    test("< operator", () => {
        const result = testSetup.SetLine("bool operator<(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */", result);
    });

    test("> operator", () => {
        const result = testSetup.SetLine("bool operator>(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */", result);
    });

    test("= operator", () => {
        const result = testSetup.SetLine("T& operator=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("+= operator", () => {
        const result = testSetup.SetLine("T& operator+=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("-= operator", () => {
        const result = testSetup.SetLine("T& operator-=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("*= operator", () => {
        const result = testSetup.SetLine("T& operator*=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("/= operator", () => {
        const result = testSetup.SetLine("T& operator/=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("%= operator", () => {
        const result = testSetup.SetLine("T& operator%=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("^= operator", () => {
        const result = testSetup.SetLine("T& operator^=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("&= operator", () => {
        const result = testSetup.SetLine("T& operator&=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("|= operator", () => {
        const result = testSetup.SetLine("T& operator|=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test(">>= operator", () => {
        const result = testSetup.SetLine("T& operator>>=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("<<= operator", () => {
        const result = testSetup.SetLine("T& operator<<=(const T& t);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param t \n * @return T& \n */", result);
    });

    test("prefix ++ operator", () => {
        const result = testSetup.SetLine("T& operator++();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return T& \n */", result);
    });

    test("prefix -- operator", () => {
        const result = testSetup.SetLine("T& operator--();").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return T& \n */", result);
    });

    test("postfix ++ operator", () => {
        const result = testSetup.SetLine("T operator++(int);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return T \n */", result);
    });

    test("postfix -- operator", () => {
        const result = testSetup.SetLine("T operator--(int);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @return T \n */", result);
    });

    test(", operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("->* operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("-> operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("[] operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("() operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("new operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("new[] operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("delete operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("delete[] operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("user literal operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });

    test("conversion operator", () => {
        const result = testSetup.SetLine("T operator+(const T& lhs, const T2& rhs);").GetResult();
        assert.equal("/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */", result);
    });
});

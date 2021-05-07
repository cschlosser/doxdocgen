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
suite("C++ - Operators Tests", () => {
    const testSetup: TestSetup = new TestSetup("void foo();");

    // Tests
    test("+ operator", () => {
        const result = testSetup.SetLine("T operator +(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test("- operator", () => {
        const result = testSetup.SetLine("T operator- (const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test("* operator with params", () => {
        const result = testSetup.SetLine("T operator*(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test("/ operator", () => {
        const result = testSetup.SetLine("T operator/(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test("% operator", () => {
        const result = testSetup.SetLine("T operator%(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test("^ operator", () => {
        const result = testSetup.SetLine("T operator^(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test("& operator with params", () => {
        const result = testSetup.SetLine("T operator&(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test("| operator", () => {
        const result = testSetup.SetLine("T operator|(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test("~ operator", () => {
        const result = testSetup.SetLine("T operator~(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T \n */");
    });

    test("<< operator", () => {
        const result = testSetup.SetLine("T operator<<(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test(">> operator", () => {
        const result = testSetup.SetLine("T operator>>(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return T \n */");
    });

    test("! operator", () => {
        const result = testSetup.SetLine("bool operator!(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return true \n * @return false \n */");
    });

    test("&& operator", () => {
        const result = testSetup.SetLine("bool operator&&(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */");
    });

    test("|| operator", () => {
        const result = testSetup.SetLine("bool operator||(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */");
    });

    test("!= operator", () => {
        const result = testSetup.SetLine("bool operator!=(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */");
    });

    test("== operator", () => {
        const result = testSetup.SetLine("bool operator==(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */");
    });

    test("<= operator", () => {
        const result = testSetup.SetLine("bool operator<=(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */");
    });

    test(">= operator", () => {
        const result = testSetup.SetLine("bool operator>=(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */");
    });

    test("< operator", () => {
        const result = testSetup.SetLine("bool operator<(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */");
    });

    test("> operator", () => {
        const result = testSetup.SetLine("bool operator>(const T& lhs, const T2& rhs);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param lhs \n * @param rhs \n * @return true \n"
            + " * @return false \n */");
    });

    test("= operator", () => {
        const result = testSetup.SetLine("T& operator=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("+= operator", () => {
        const result = testSetup.SetLine("T& operator+=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("-= operator", () => {
        const result = testSetup.SetLine("T& operator-=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("*= operator", () => {
        const result = testSetup.SetLine("T& operator*=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("/= operator", () => {
        const result = testSetup.SetLine("T& operator/=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("%= operator", () => {
        const result = testSetup.SetLine("T& operator%=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("^= operator", () => {
        const result = testSetup.SetLine("T& operator^=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("&= operator", () => {
        const result = testSetup.SetLine("T& operator&=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("|= operator", () => {
        const result = testSetup.SetLine("T& operator|=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test(">>= operator", () => {
        const result = testSetup.SetLine("T& operator>>=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("<<= operator", () => {
        const result = testSetup.SetLine("T& operator<<=(const T& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T& \n */");
    });

    test("prefix ++ operator", () => {
        const result = testSetup.SetLine("T& operator++();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return T& \n */");
    });

    test("prefix -- operator", () => {
        const result = testSetup.SetLine("T& operator--();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return T& \n */");
    });

    test("postfix ++ operator", () => {
        const result = testSetup.SetLine("T operator++(int);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return T \n */");
    });

    test("postfix -- operator", () => {
        const result = testSetup.SetLine("T operator--(int);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return T \n */");
    });

    test("() operator", () => {
        let result = testSetup.SetLine("R operator()(const T& a, const T2& b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n * @param b \n * @return R \n */");

        result = testSetup.SetLine("R operator( )(const T& a, const T2& b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n * @param b \n * @return R \n */");
    });

    test(", operator", () => {
        const result = testSetup.SetLine("T2& operator , (const T2& t);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param t \n * @return T2& \n */");
    });

    test("* operator without params", () => {
        const result = testSetup.SetLine("R& operator*();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return R& \n */");
    });

    test("& operator without params", () => {
        const result = testSetup.SetLine("R* operator&();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return R* \n */");
    });

    test("->* operator", () => {
        const result = testSetup.SetLine("R& operator->*();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return R& \n */");
    });

    test("-> operator", () => {
        const result = testSetup.SetLine("R* operator->();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return R* \n */");
    });

    test("[] operator", () => {
        let result = testSetup.SetLine("R operator[](S b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param b \n * @return R \n */");

        result = testSetup.SetLine("R operator[ ](S b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param b \n * @return R \n */");
    });

    test("new operator", () => {
        const result = testSetup.SetLine("void* operator new ( std::size_t count );").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param count \n * @return void* \n */");
    });

    test("new[] operator", () => {
        let result = testSetup.SetLine("void* operator new[]( std::size_t count, std::align_val_t al);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param count \n * @param al \n * @return void* \n */");

        result = testSetup.SetLine("void* operator new[ ]( std::size_t count, std::align_val_t al);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param count \n * @param al \n * @return void* \n */");
    });

    test("delete operator", () => {
        const result = testSetup.SetLine("void operator delete(void* ptr, std::size_t sz, std::align_val_t al);")
            .GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param ptr \n * @param sz \n * @param al \n */");
    });

    test("delete[] operator", () => {
        let result = testSetup.SetLine("void operator delete[] (void* ptr);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param ptr \n */");

        result = testSetup.SetLine("void operator delete [ ] (void* ptr);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param ptr \n */");
    });

    test("user literal operator", () => {
        let result = testSetup.SetLine("long double operator\"\"_My_C00l_Conversion(const char * str);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param str \n * @return long double \n */");

        result = testSetup.SetLine("long double operator \"\"_My_C00l_Conversion(const char * str);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param str \n * @return long double \n */");

        result = testSetup.SetLine("long double operator\"\"_My_C00l_Conversion (const char * str);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param str \n * @return long double \n */");
    });

    test("Implicit conversion operator", () => {
        const result = testSetup.SetLine("operator int() const;").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return int \n */");
    });

    test("Explicit conversion operator", () => {
        const result = testSetup.SetLine("explicit operator int() const;").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return int \n */");
    });

    test("conversion operator to struct", () => {
        const result = testSetup.SetLine("explicit operator struct foo() const;").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return struct foo \n */");
    });

    test("conversion operator to struct pointer", () => {
        const result = testSetup.SetLine("explicit operator struct foo*() const;").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @return struct foo* \n */");
    });
});

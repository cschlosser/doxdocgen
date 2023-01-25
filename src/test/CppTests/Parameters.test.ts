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
suite("C++ - Parameters Tests", () => {

    const testSetup: TestSetup = new TestSetup("void foo();");
    const testSetupWithType: TestSetup = new TestSetup("void foo();");

    testSetupWithType.cfg.Generic.paramTemplate = "@param [{type}] {param} ";

    // Tests
    test("No parameters", () => {
        let result = testSetup.SetLine("void foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n */");

        result = testSetupWithType.SetLine("void foo();").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n */");
    });

    test("Single parameter", () => {
        let result = testSetup.SetLine("void foo(int a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetupWithType.SetLine("void foo(int a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a \n */");
    });

    test("Multiple parameters", () => {
        let result = testSetup.SetLine("void foo(int a, int b, int c);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n * @param b \n * @param c \n */");

        result = testSetupWithType.SetLine("void foo(int a, int b, int c);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a \n * @param [int] b \n * @param [int] c \n */");
    });

    test("Parameters with numbers in them", () => {
        let result = testSetup.SetLine("void foo(int a1, int b23);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b23 \n */");

        result = testSetupWithType.SetLine("void foo(int a1, int b23);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a1 \n * @param [int] b23 \n */");
    });

    test("Reference parameter", () => {
        let result = testSetup.SetLine("void foo(int& a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetupWithType.SetLine("void foo(int& a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int&] a \n */");
    });

    test("Reference parameter with unsigned interger qualifier", () => {
        let result = testSetup.SetLine("void foo(unsigned int& a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetupWithType.SetLine("void foo(unsigned int& a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [unsigned int&] a \n */");
    });

    test("Reference parameter with const qualifier", () => {
        let result = testSetup.SetLine("void foo(const int& a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetupWithType.SetLine("void foo(const int& a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [const int&] a \n */");
    });

    test("Reference parameter with const and interger qualifier", () => {
        let result = testSetup.SetLine("void foo(const unsigned int& a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetupWithType.SetLine("void foo(const unsigned int& a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [const unsigned int&] a \n */");
    });

    test("Pointer parameter", () => {
        let result = testSetup.SetLine("void foo(int* a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetupWithType.SetLine("void foo(int* a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int*] a \n */");
    });

    test("Const parameter", () => {
        let result = testSetup.SetLine("void foo(const int a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n */");

        result = testSetup.SetLine("void foo(int const a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n */");

        result = testSetupWithType.SetLine("void foo(const int a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [const int] a1 \n */");

        result = testSetupWithType.SetLine("void foo(int const a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int const] a1 \n */");
    });

    test("Struct parameter", () => {
        let result = testSetup.SetLine("void foo(int a1, int b23);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b23 \n */");

        result = testSetupWithType.SetLine("void foo(int a1, int b23);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a1 \n * @param [int] b23 \n */");
    });

    test("Template parameter", () => {
        let result = testSetup.SetLine("void foo(Matrix<T, N, M> mat);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param mat \n */");

        result = testSetupWithType.SetLine("void foo(Matrix<T, N, M> mat);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [Matrix<T, N, M>] mat \n */");
    });

    test("Enum parameter", () => {
        let result = testSetup.SetLine("void foo(enum foo bar);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param bar \n */");

        result = testSetupWithType.SetLine("void foo(enum foo bar);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [enum foo] bar \n */");
    });

    test("Const parameter with const pointer to const pointer", () => {
        let result = testSetup.SetLine("void foo(const int * const * const a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n */");

        result = testSetup.SetLine("void foo(int const * const * const a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n */");

        result = testSetupWithType.SetLine("void foo(const int * const * const a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [const int* const* const] a1 \n */");

        result = testSetupWithType.SetLine("void foo(int const * const * const a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int const* const* const] a1 \n */");
    });

    test("Fundamental return type with modifiers", () => {
        let result = testSetup.SetLine("void foo(unsigned int a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetup.SetLine("void foo(unsigned short int a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetup.SetLine("void foo(signed short a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetup.SetLine("void foo(long a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetup.SetLine("void foo(unsigned long long int a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetup.SetLine("void foo(signed a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetup.SetLine("void foo(unsigned a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetup.SetLine("void foo(unsigned char a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetup.SetLine("void foo(long double a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a \n */");

        result = testSetup.SetLine("void foo(long unsigned unsigned_a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param unsigned_a \n */");

        result = testSetupWithType.SetLine("void foo(unsigned int a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [unsigned int] a \n */");

        result = testSetupWithType.SetLine("void foo(unsigned short int a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [unsigned short int] a \n */");

        result = testSetupWithType.SetLine("void foo(signed short a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [signed short] a \n */");

        result = testSetupWithType.SetLine("void foo(long a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [long] a \n */");

        result = testSetupWithType.SetLine("void foo(unsigned long long int a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [unsigned long long int] a \n */");

        result = testSetupWithType.SetLine("void foo(signed a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [signed] a \n */");

        result = testSetupWithType.SetLine("void foo(unsigned a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [unsigned] a \n */");

        result = testSetupWithType.SetLine("void foo(unsigned char a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [unsigned char] a \n */");

        result = testSetupWithType.SetLine("void foo(long double a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [long double] a \n */");

        result = testSetupWithType.SetLine("void foo(long unsigned unsigned_a);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [long unsigned] unsigned_a \n */");
    });

    test("Parameter type in namespace", () => {
        let result = testSetup.SetLine("void foo(MyNamespace::Foo a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n */");

        result = testSetupWithType.SetLine("void foo(MyNamespace::Foo a1);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [MyNamespace::Foo] a1 \n */");
    });

    test("Parameter template type in namespace", () => {
        let result = testSetup.SetLine("void foo(Math::Matrix<A, B, C> mat);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param mat \n */");

        result = testSetupWithType.SetLine("void foo(Math::Matrix<A, B, C> mat);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [Math::Matrix<A, B, C>] mat \n */");
    });

    test("Parameter template type within templated namespace", () => {
        let result = testSetup.SetLine("void foo(Matrix<A, B, C>::Matrix<A, B, C> mat);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param mat \n */");

        result = testSetupWithType.SetLine("void foo(Matrix<A, B, C>::Matrix<A, B, C> mat);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [Matrix<A, B, C>::Matrix<A, B, C>] mat \n */");
    });

    test("Parameter type in nested namespacee", () => {
        let result = testSetup.SetLine("void foo( Math::LA::Matrix<A, B, C> mat);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param mat \n */");

        result = testSetupWithType.SetLine("void foo( Math::LA::Matrix<A, B, C> mat);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [Math::LA::Matrix<A, B, C>] mat \n */");
    });

    test("Parameter with default char literal", () => {
        let result = testSetup.SetLine("void foo(char a1 = 'a', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(char a1 = u'b', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(char a1 = u8'b', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(char a1 = U'a', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(char a1 = l',', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(int a1 = 'ab', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetupWithType.SetLine("void foo(char a1 = 'a', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [char] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(char a1 = u'b', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [char] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(char a1 = u8'b', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [char] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(char a1 = U'a', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [char] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(char a1 = l',', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [char] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(int a1 = 'ab', int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a1 \n * @param [int] b \n */");
    });

    test("Parameter with default string literal", () => {
        let result = testSetup.SetLine("void foo(std::string a1 = \"bar\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(std::string a1 = u\"bar, test\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(std::string a1 = u8\"bar\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(std::string a1 = U\"bar\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(std::string a1 = l\"bar\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(std::string a1 = R\"(bar\\t\\\")\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetupWithType.SetLine("void foo(std::string a1 = \"bar\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [std::string] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(std::string a1 = u\"bar, test\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [std::string] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(std::string a1 = u8\"bar\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [std::string] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(std::string a1 = U\"bar\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [std::string] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(std::string a1 = l\"bar\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [std::string] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(std::string a1 = R\"(bar\\t\\\")\", int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [std::string] a1 \n * @param [int] b \n */");
    });

    test("Parameter with default integer literal", () => {
        let result = testSetup.SetLine("void foo(int a1 = 1337, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(int a1 = 01337, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(int a1 = 1337, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(int a1 = 0x0FAB, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(int a1 = 0X0FAB, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(std::uint8_t a1 = 0b110011, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(std::byte a1 = 0B11111, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(long a1 = 1337l, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(long long a1 = 1337ll, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(unsigned long long a1 = 1337ull, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(long a1 = 1337L, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(long long a1 = 1337LL, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(unsigned long long a1 = 1337ULL, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetupWithType.SetLine("void foo(int a1 = 1337, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(int a1 = 01337, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(int a1 = 1337, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(int a1 = 0x0FAB, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(int a1 = 0X0FAB, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(std::uint8_t a1 = 0b110011, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [std::uint8_t] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(std::byte a1 = 0B11111, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [std::byte] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(long a1 = 1337l, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [long] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(long long a1 = 1337ll, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [long long] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(unsigned long long a1 = 1337ull, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [unsigned long long] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(long a1 = 1337L, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [long] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(long long a1 = 1337LL, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [long long] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(unsigned long long a1 = 1337ULL, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [unsigned long long] a1 \n * @param [int] b \n */");
    });

    test("Parameter with default floating point literal", () => {
        let result = testSetup.SetLine("void foo(double a1 = 1e10, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(double a1 = 1., int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(double a1 = .1, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(double a1 = 0.1e-1, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(float a1 = 1.0f, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(float a1 = 1.0F, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(long double a1 = 1.0lf, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(long double a1 = 1.0LF, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(double a1 = 0xa.bp10, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetup.SetLine("void foo(double a1 = 0xa.bp10l, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetupWithType.SetLine("void foo(double a1 = 1e10, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [double] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(double a1 = 1., int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [double] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(double a1 = .1, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [double] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(double a1 = 0.1e-1, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [double] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(float a1 = 1.0f, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [float] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(float a1 = 1.0F, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [float] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(long double a1 = 1.0lf, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [long double] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(long double a1 = 1.0LF, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [long double] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(double a1 = 0xa.bp10, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [double] a1 \n * @param [int] b \n */");

        result = testSetupWithType.SetLine("void foo(double a1 = 0xa.bp10l, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [double] a1 \n * @param [int] b \n */");
    });

    test("Parameter with default compound literal", () => {
        let result = testSetup.SetLine("void foo(struct Bar a1 = {2, 3}, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetupWithType.SetLine("void foo(struct Bar a1 = {2, 3}, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [struct Bar] a1 \n * @param [int] b \n */");
    });

    test("Parameter with default template function call", () => {
        let result = testSetup.SetLine("void foo(struct Bar a1 = test::baz<3, 2, 5>(23), int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetupWithType.SetLine("void foo(struct Bar a1 = test::baz<3, 2, 5>(23), int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [struct Bar] a1 \n * @param [int] b \n */");
    });

    test("Parameter with default user defined literal.", () => {
        let result = testSetup.SetLine("void foo(double a1 = 0xa.bp10l_deg_test, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param a1 \n * @param b \n */");

        result = testSetupWithType.SetLine("void foo(double a1 = 0xa.bp10l_deg_test, int b);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [double] a1 \n * @param [int] b \n */");
    });

    test("Member pointer as parameter", () => {
        let result = testSetup.SetLine("void test(int foo::* memberPointer);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param memberPointer \n */");

        result = testSetupWithType.SetLine("void test(int foo::* memberPointer);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [int foo::*] memberPointer \n */");
    });

    test("Restrict keyword", () => {
        let result = testSetup.SetLine("void some_function(char *restrict buf, const size_t buflen);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param buf \n * @param buflen \n */");

        result = testSetupWithType.SetLine("void some_function(char *restrict buf, const size_t buflen);").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [char* restrict] buf \n * @param [const size_t] buflen \n */");
    });

    test("Type as variable name", () => {
        let result = testSetup.SetLine("void MapPoint(double latitude, double longtitude) const;").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param latitude \n * @param longtitude \n */");

        result = testSetup.SetLine("void MapPoint(double latitude, double long int floattitude) const;").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param latitude \n * @param floattitude \n */");

        result = testSetupWithType.SetLine("void MapPoint(double latitude, double longtitude) const;").GetResult();
        assert.strictEqual(result, "/**\n * @brief \n * \n * @param [double] latitude \n * @param [double] longtitude \n */");

        result = testSetupWithType.SetLine(
            "void MapPoint(double latitude, double long int floattitude) const;",
        ).GetResult();
        assert.strictEqual(
            result,
            "/**\n * @brief \n * \n * @param [double] latitude \n * @param [double long int] floattitude \n */",
        );
    });
});

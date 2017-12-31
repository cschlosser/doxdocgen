import { Position, TextDocumentContentChangeEvent, TextEditor, TextLine, workspace } from "vscode";
import ICodeParser from "../../Common/ICodeParser";
import { IDocGen } from "../../Common/IDocGen";
import { Config } from "../../Config";
import { CArgument } from "./CArgument";
import CDocGen from "./CDocGen";
import { CParseTree } from "./CParseTree";
import { CToken, CTokenType } from "./CToken";

/**
 *
 * Parses C code for methods and signatures
 *
 * @export
 * @class CParser
 * @implements {ICodeParser}
 */
export default class CParser implements ICodeParser {
    protected activeEditor: TextEditor;
    protected activeSelection: Position;
    protected readonly cfg: Config;

    private typeKeywords: string[];
    private stripKeywords: string[];
    private keywords: string[];
    private attributes: string[];
    private lexerVocabulary;

    constructor(cfg: Config) {
        this.cfg = cfg;

        this.typeKeywords = [
            "constexpr",
            "const",
            "struct",
        ];

        this.stripKeywords = [
            "final",
            "static",
            "inline",
            "friend",
            "virtual",
            "extern",
            "explicit",
            "class",
            "override",
            "typename",
        ];

        this.attributes = [
            "noexcept",
            "throw",
            "alignas",
        ];

        // Non type keywords will be stripped from the final return type.
        this.keywords = this.typeKeywords.concat(this.stripKeywords);

        this.lexerVocabulary = {
            ArraySubscript: (x: string): string => (x.match("^\\[[^\\[]*?\\]") || [])[0],
            Arrow: (x: string): string => (x.match("^->") || [])[0],
            Assignment: (x: string): string => (x.match("^=") || [])[0],
            Attribute: (x: string): string => {
                const attribute: string = (x.match("^\\[\\[[^\\[]*?\\]\\]") || [])[0];
                if (attribute !== undefined) {
                    return attribute;
                }

                const foundIndex: number = this.attributes
                    .findIndex((n: string) => x.startsWith(n) === true);

                if (foundIndex === -1) {
                    return undefined;
                }

                if (x.slice(this.attributes[foundIndex].length).trim().startsWith("(") === false) {
                    return x.slice(0, this.attributes[foundIndex].length);
                }

                const startEndOffset: number[] = this.GetSubExprStartEnd(x, 0, "(", ")");
                return startEndOffset[1] === 0 ? undefined : x.slice(0, startEndOffset[1]);
            },
            CloseParenthesis: (x: string): string => (x.match("^\\)") || [])[0],
            Comma: (x: string): string => (x.match("^,") || [])[0],
            CommentBlock: (x: string): string => {
                if (x.startsWith("/*") === false) {
                    return undefined;
                }

                let closeOffset: number = x.indexOf("*/");
                closeOffset = closeOffset === -1 ? x.length : closeOffset + 2;
                return x.slice(0, closeOffset);
            },
            CommentLine: (x: string): string => {
                if (x.startsWith("//") === false) {
                    return undefined;
                }

                let closeOffset: number = x.indexOf("\n");
                closeOffset = closeOffset === -1 ? x.length : closeOffset + 1;
                return x.slice(0, closeOffset);
            },
            CurlyBlock: (x: string): string => {
                if (x.startsWith("{") === false) {
                    return undefined;
                }
                const startEndOffset: number[] = this.GetSubExprStartEnd(x, 0, "{", "}");
                return startEndOffset[1] === 0 ? undefined : x.slice(0, startEndOffset[1]);
            },
            Ellipsis: (x: string): string => (x.match("^\\.\\.\\.") || [])[0],
            OpenParenthesis: (x: string): string => (x.match("^\\(") || [])[0],
            Pointer: (x: string): string => (x.match("^\\*") || [])[0],
            Reference: (x: string): string => (x.match("^&") || [])[0],
            Symbol: (x: string): string => {
                // Handle access specifiers since they aren't really symbols.
                if (x.startsWith("public:") || x.startsWith("protected:") || x.startsWith("private:")) {
                    return undefined;
                }

                // Handle specifiers
                const specifierFound: number = this.attributes
                    .findIndex((n: string) => x.startsWith(n) === true);

                if (specifierFound !== -1) {
                    return undefined;
                }

                // Handle decltype special cases.
                if (x.startsWith("decltype") === true) {
                    const startEndOffset: number[] = this.GetSubExprStartEnd(x, 0, "(", ")");
                    return startEndOffset[1] === 0 ? undefined : x.slice(0, startEndOffset[1]);
                }

                // Special case group up the fundamental types with the modifiers.
                // tslint:disable-next-line:max-line-length
                let reMatch: string = (x.match("^(unsigned|signed|short|long|int|char|double)(\\s+(unsigned|signed|short|long|int|char|double))+") || [])[0];
                if (reMatch !== undefined) {
                    return reMatch.trim();
                }

                // Regex to handle a part of all symbols and includes all symbol special cases.
                // This is run in a loop because template parts of a symbol can't be parsed using regex.
                // tslint:disable-next-line:max-line-length
                const symbolRegex: string = "^([a-z|A-Z|:|_|~|\\d]*operator\\s*(\"\"_[a-z|A-Z]+|>>=|<<=|->\\*|\\+=|-=|\\*=|\\/=|%=|\\^=|&=|\\|=|<<|>>|==|!=|<=|->|>=|&&|\\|\\||\\+\\+|--|\\+|-|\\*|\\/|%|\\^|&|\||~|!|=|<|>|,|\\[\\s*\\]|\\(\\s*\\)|(new|delete)\\s*(\\[\\s*\\]){0,1}){0,1}|[a-z|A-Z|:|_|~|\\d]+)";

                reMatch = (x.match(symbolRegex) || [])[0];
                if (reMatch === undefined) {
                    return undefined;
                }

                let symbol: string = reMatch;
                while (true) {
                    if (x.slice(symbol.length).trim().startsWith("<") === true) {
                        const offsets: number[] = this.GetSubExprStartEnd(x, symbol.length, "<", ">");
                        if (offsets[1] === 0) {
                            return undefined;
                        }
                        symbol = x.slice(0, offsets[1]);
                    }

                    reMatch = (x.slice(symbol.length).match(symbolRegex) || [])[0];
                    if (reMatch === undefined) {
                        break;
                    }

                    symbol += reMatch;
                }

                return symbol.replace(/\s+$/, "");
            },
        };
    }

    /**
     * @inheritdoc
     */
    public Parse(activeEdit: TextEditor): IDocGen {
        this.activeEditor = activeEdit;
        this.activeSelection = this.activeEditor.selection.active;

        let line: string = "";
        try {
            line = this.getLogicalLine();
        } catch (err) {
            // console.dir(err);
        }

        // template parsing is simpler by using heuristics rather then CTokenizing first.
        const templateArgs: string[] = [];
        while (line.startsWith("template")) {
            const template: string = this.GetTemplate(line);

            templateArgs.push.apply(templateArgs, this.GetArgsFromTemplate(template));

            line = line.slice(template.length, line.length + 1).trim();
        }

        let args: [CArgument, CArgument[]] = [new CArgument(), []];
        try {
            args = this.GetReturnAndArgs(line);
        } catch (err) {
            // console.dir(err);
        }

        return new CDocGen(
            this.activeEditor,
            this.activeSelection,
            this.cfg,
            templateArgs,
            args[0],
            args[1],
        );
    }

    /***************************************************************************
                                    Implementation
     ***************************************************************************/
    private getLogicalLine(): string {
        let logicalLine: string = "";

        let nextLine: Position = new Position(this.activeSelection.line + 1, this.activeSelection.character);

        let nextLineTxt: string = this.activeEditor.document.lineAt(nextLine.line).text.trim();

        // VSCode may enter a * on itself, we don"t want that in our method
        if (nextLineTxt === "*") {
            nextLineTxt = "";
        }

        let currentNest: number = 0;
        logicalLine = nextLineTxt;

        // Get method end line
        let linesToGet: number = 20;
        while (linesToGet-- > 0) { // Check for end of expression.
            nextLine = new Position(nextLine.line + 1, nextLine.character);
            nextLineTxt = this.activeEditor.document.lineAt(nextLine.line).text.trim();

            // Check if method has finished if curly brace is opened while
            // nesting is occuring.
            for (let i: number = 0; i < nextLineTxt.length; i++) {
                if (nextLineTxt[i] === "(") {
                    currentNest++;
                } else if (nextLineTxt[i] === ")") {
                    currentNest--;
                } else if (nextLineTxt[i] === "{" && currentNest === 0) {
                    logicalLine += "\n" + nextLineTxt.slice(0, i);
                    return logicalLine.replace(/^\s+|\s+$/g, "");
                } else if ((nextLineTxt[i] === ";"
                    || (nextLineTxt[i] === ":" && nextLineTxt[i - 1] !== ":" && nextLineTxt[i + 1] !== ":"))
                    && currentNest === 0) {

                    logicalLine += "\n" + nextLineTxt.slice(0, i);
                    return logicalLine.replace(/^\s+|\s+$/g, "");
                }
            }

            logicalLine += "\n" + nextLineTxt;
        }

        throw new Error("More then 20 lines were gotten from editor and no end of expression was found.");
    }

    private Tokenize(expression: string): CToken[] {
        const CTokens: CToken[] = [];
        expression = expression.replace(/^\s+|\s+$/g, "");

        while (expression.length !== 0) {
            const matches: CToken[] = Object.keys(this.lexerVocabulary)
                .map((k): CToken => new CToken(CTokenType[k], this.lexerVocabulary[k](expression)))
                .filter((t) => t.value !== undefined);

            if (matches.length === 0) {
                throw new Error("Next CToken couldn\'t be determined: " + expression);
            } else if (matches.length > 1) {
                throw new Error("Multiple matches for next CToken: " + expression);
            }

            CTokens.push(matches[0]);
            expression = expression.slice(matches[0].value.length, expression.length).replace(/^\s+|\s+$/g, "");
        }

        return CTokens;
    }

    private GetReturnAndArgs(line: string): [CArgument, CArgument[]] {
        // CTokenize rest of expression and remove comment CTokens;
        const CTokens: CToken[] = this.Tokenize(line)
            .filter((t) => t.type !== CTokenType.CommentBlock)
            .filter((t) => t.type !== CTokenType.CommentLine);

        // Create hierarchical tree based on the parenthesis.
        const tree: CParseTree = CParseTree.CreateTree(CTokens).Compact();

        // return argument.
        const func = this.GetArgument(tree);
        // check if it is a constructor or descructor since these have no name..
        // and reverse the assignment of type and name.
        if (func.name === null) {
            if (func.type.nodes.length !== 1) {
                throw new Error("Too many symbols found for constructor/descructor.");
            } else if (func.type.nodes[0] instanceof CParseTree) {
                throw new Error("One node found with just a CParseTree. Malformed input.");
            }

            func.name = (func.type.nodes[0] as CToken).value;
            func.type.nodes = [];
        }

        // Get arguments list as a CParseTree and create arguments from them.
        const params = this.GetArgumentList(tree)
            .map((a) => this.GetArgument(a));

        return [func, params];
    }

    private RemoveUnusedTokens(tree: CParseTree): CParseTree {
        tree = tree.Copy();

        // First slice of everything after assignment since that will not be used.
        const assignmentIndex = tree.nodes.findIndex((n) => n instanceof CToken && n.type === CTokenType.Assignment);
        if (assignmentIndex !== -1) {
            tree.nodes = tree.nodes.slice(0, assignmentIndex);
        }

        // Specifiers aren't needed so remove them.
        tree.nodes = tree.nodes
            .filter((n) => n instanceof CParseTree || (n instanceof CToken && n.type !== CTokenType.Attribute));

        return tree;
    }

    private GetArgumentList(tree: CParseTree): CParseTree[] {
        const args: CParseTree[] = [];

        tree = this.RemoveUnusedTokens(tree);

        let cursor: CParseTree = tree;
        while (this.IsFuncPtr(cursor.nodes) === true) {
            cursor = cursor.nodes.find((n) => n instanceof CParseTree) as CParseTree;
        }

        const argTree: CParseTree = cursor.nodes.find((n) => n instanceof CParseTree) as CParseTree;
        if (argTree === undefined) {
            throw new Error("Function arguments not found.");
        }

        // Split the argument tree on commas
        let arg: CParseTree = new CParseTree();
        for (const node of argTree.nodes) {
            if (node instanceof CToken && node.type === CTokenType.Comma) {
                args.push(arg);
                arg = new CParseTree();
            } else {
                arg.nodes.push(node);
            }
        }

        if (arg.nodes.length > 0) {
            args.push(arg);
        }

        return args;
    }

    private IsFuncPtr(nodes: Array<CToken | CParseTree>) {
        return nodes.filter((n) => n instanceof CParseTree).length === 2;
    }

    private StripNonTypeNodes(tree: CParseTree) {
        tree.nodes = tree.nodes
            // All strippable keywords.
            .filter((n) => {
                return !(n instanceof CToken
                    && n.type === CTokenType.Symbol
                    && this.stripKeywords.find((k) => k === n.value) !== undefined);
            });
    }

    private GetArgumentFromTrailingReturn(tree: CParseTree, startTrailingReturn: number): CArgument {
        const argument: CArgument = new CArgument();

        // Find index of auto prior to the first CParseTree.
        // If auto is not found something is going wrong since trailing return
        // requires auto.
        let autoIndex: number = -1;
        for (let i: number = 0; i < tree.nodes.length; i++) {
            const node = tree.nodes[i];
            if (node instanceof CParseTree) {
                break;
            }
            if (node.type === CTokenType.Symbol && node.value === "auto") {
                autoIndex = i;
                break;
            }
        }

        if (autoIndex === -1) {
            throw new Error("Function declaration has trailing return but type is not auto.");
        }

        // Get symbol between auto and CParseTree which is the argument name. It also may not be a keyword.
        for (let i: number = autoIndex + 1; i < tree.nodes.length; i++) {
            const node = tree.nodes[i];
            if (node instanceof CParseTree) {
                break;
            }
            if (node.type === CTokenType.Symbol && this.keywords.find((k) => k === node.value) === undefined) {
                argument.name = node.value;
                break;
            }
        }

        argument.type.nodes = tree.nodes.slice(startTrailingReturn + 1, tree.nodes.length);
        this.StripNonTypeNodes(argument.type);

        return argument;
    }

    private GetArgumentFromFuncPtr(tree: CParseTree): CArgument {
        const argument: CArgument = new CArgument();

        argument.type = tree;

        let cursor: CParseTree = tree;

        while (this.IsFuncPtr(cursor.nodes) === true) {
            cursor = cursor.nodes.find((n) => n instanceof CParseTree) as CParseTree;
        }

        // Remove CParseTree. This can be if it is a function declaration.
        const argumentsIndex = cursor.nodes.findIndex((n) => n instanceof CParseTree);
        if (argumentsIndex !== -1) {
            cursor.nodes.splice(argumentsIndex, 1);
        }

        // Find first symbol that is the argument name.
        // Remove it from the tree and set the name to the argument name
        for (let i: number = 0; i < cursor.nodes.length; i++) {
            const node = cursor.nodes[i];
            if (node instanceof CParseTree) {
                continue;
            }

            if (node.type === CTokenType.Symbol && this.keywords.find((k) => k === node.value) === undefined) {
                argument.name = node.value;
                cursor.nodes.splice(i, 1);
            }
        }

        this.StripNonTypeNodes(argument.type);
        return argument;
    }

    private GetDefaultArgument(tree: CParseTree): CArgument {
        const argument: CArgument = new CArgument();

        for (const node of tree.nodes) {
            if (node instanceof CParseTree) {
                break;
            }
            const symbolCount = argument.type.nodes
                .filter((n) => n instanceof CToken)
                .map((n) => n as CToken)
                .filter((n) => n.type === CTokenType.Symbol)
                .filter((n) => this.keywords.find((k) => k === n.value) === undefined)
                .length;

            if (node.type === CTokenType.Symbol
                && this.keywords.find((k) => k === node.value) === undefined
            ) {
                if (symbolCount === 1 && argument.name === null) {
                    argument.name = node.value;
                    continue;
                } else if (symbolCount > 1) {
                    throw new Error("Too many non keyword symbols.");
                }
            }

            argument.type.nodes.push(node);
        }

        this.StripNonTypeNodes(argument.type);
        return argument;
    }

    private GetArgument(tree: CParseTree): CArgument {
        // Copy tree structure leave original untouched.
        const copy = this.RemoveUnusedTokens(tree);

        // Special case with only ellipsis. C style variadic arguments
        if (copy.nodes.length === 1) {
            const node = copy.nodes[0];
            if (node instanceof CToken && node.type === CTokenType.Ellipsis) {
                const argument: CArgument = new CArgument();
                argument.name = node.value;
                return argument;
            }
        }

        // Check if it is has a trailing return.
        const startTrailingReturn: number = copy.nodes
            .findIndex((t) => t instanceof CToken ? t.type === CTokenType.Arrow : false);

        // Special case trailing return.
        if (startTrailingReturn !== -1) {
            return this.GetArgumentFromTrailingReturn(copy, startTrailingReturn);
        }

        // Handle function pointers
        if (this.IsFuncPtr(copy.nodes) === true) {
            return this.GetArgumentFromFuncPtr(copy);
        }

        return this.GetDefaultArgument(copy);
    }

    private GetSubExprStartEnd(expression: string, startSearch: number, openExpr: string, closeExpr: string): number[] {
        let openExprOffset: number = -1;
        let nestedCount: number = 0;
        for (let i: number = startSearch; i < expression.length; i++) {
            if (expression[i] === openExpr && openExprOffset === -1) {
                openExprOffset = i;
            }

            if (expression[i] === openExpr) {
                nestedCount++;
            } else if (expression[i] === closeExpr && nestedCount > 0) {
                nestedCount--;
            }

            if (expression[i] === closeExpr && nestedCount === 0 && openExprOffset !== -1) {
                return [openExprOffset, i + 1];
            }
        }

        return [0, 0];
    }

    private GetTemplate(expression: string): string {
        if (expression.startsWith("template") === false) {
            return "";
        }

        let startTemplateOffset: number = -1;
        for (let i: number = "template".length; i < expression.length; i++) {
            if (expression[i] === "<") {
                startTemplateOffset = i;
                break;
            } else if (expression[i] !== " ") {
                return "";
            }
        }

        if (startTemplateOffset === -1) {
            return "";
        }

        const [start, end] = this.GetSubExprStartEnd(expression, startTemplateOffset, "<", ">");
        return expression.slice(0, end);
    }

    private GetArgsFromTemplate(template: string): string[] {
        const args: string[] = [];
        if (template === "") {
            return args;
        }

        // Remove <> and add a comma to the end to remove edge case.
        template = template.slice(template.indexOf("<") + 1, template.lastIndexOf(">")).replace(/^\s+|\s+$/g, "") + ",";

        const nestedCounts: { [key: string]: number; } = {
            "(": 0,
            "<": 0,
            "{": 0,
        };

        let lastSeparator: number = 0;
        for (let i: number = 0; i < template.length; i++) {
            const notInSubExpr: boolean = nestedCounts["<"] === 0
                && nestedCounts["("] === 0
                && nestedCounts["{"] === 0;

            if (notInSubExpr === true && template[i] === ",") {
                args.push(template.slice(lastSeparator + 1, i).replace(/^\s+|\s+$/g, ""));
            } else if (notInSubExpr === true && (template[i] === " " || template[i] === ".")) {
                lastSeparator = i;
            }

            if (template[i] === "(") {
                nestedCounts["("]++;
            } else if (template[i] === ")" && nestedCounts["("] > 0) {
                nestedCounts["("]--;
            } else if (template[i] === "<") {
                nestedCounts["<"]++;
            } else if (template[i] === ">" && nestedCounts["<"] > 0) {
                nestedCounts["<"]--;
            } else if (template[i] === "{") {
                nestedCounts["{"]++;
            } else if (template[i] === "}" && nestedCounts["{"] > 0) {
                nestedCounts["{"]--;
            }
        }

        return args;
    }
}

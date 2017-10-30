import { Position, TextDocumentContentChangeEvent, TextEditor, TextLine, workspace } from "vscode";
import { Config, ConfigType } from "../../Config";
import Generator from "../../DocGen/CGen";
import { IDocGen } from "../../DocGen/DocGen";
import ICodeParser from "../CodeParser";
import { ParseTree } from "./ParseTree";
import { Token, TokenType } from "./Token";

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

    private keywords: string[];
    private lexerVocabulary;

    constructor() {
        this.keywords = [
            "static",
            "inline",
            "friend",
            "virtual",
            "extern",
            "explicit",
            "const",
            "struct",
            "class",
            "override",
        ];

        this.lexerVocabulary = {
            ArraySubscript: (x: string): string => (x.match("^\\[[^\\[]*?\\]") || [])[0],
            Arrow: (x: string): string => (x.match("^->") || [])[0],
            Assignment: (x: string): string => (x.match("^=") || [])[0],
            Attribute: (x: string): string => (x.match("^\\[\\[[^\\[]*?\\]\\]") || [])[0],
            CloseParenthesis: (x: string): string => (x.match("^\\)") || [])[0],
            Comma: (x: string): string => (x.match("^,") || [])[0],
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
                // Handle operator and decltype special cases.
                if (x.startsWith("operator") === true) {
                    const startBrace: number = x.indexOf("(");
                    return startBrace === -1 ? undefined : x.slice(0, startBrace);
                } else if (x.startsWith("decltype") === true) {
                    const startEndOffset: number[] = this.GetSubExprStartEnd(x, 0, "(", ")");
                    return startEndOffset[1] === 0 ? undefined : x.slice(0, startEndOffset[1]);
                }

                const reMatch: string = (x.match("^[a-z|A-Z|:|_|\\d]+") || [])[0];
                if (reMatch === undefined) {
                    return undefined;
                }

                // Check if symbol includes a template for instance Matrix<T, M, N> and include it if so.
                if (x.slice(reMatch.length, x.length).trim().startsWith("<") === false) {
                    return reMatch;
                }

                const offsets: number[] = this.GetSubExprStartEnd(x, reMatch.length, "<", ">");
                return offsets[1] === 0 ? undefined : x.slice(0, offsets[1]);
            },
        };
    }

    /**
     * @inheritdoc
     */
    public Parse(activeEdit: TextEditor, event: TextDocumentContentChangeEvent): IDocGen {
        this.activeEditor = activeEdit;
        this.activeSelection = this.activeEditor.selection.active;

        const activeLine: TextLine = this.activeEditor.document.lineAt(this.activeEditor.selection.active.line);

        let line: string = this.getLogicalLine();

        // Not a method
        if (line.length === 0) {
            return null;
        }

        // template parsing is simpler by using heuristics rather then tokenizing first.
        const template: string = this.GetTemplate(line);
        const templateArgs: string[] = this.GetArgsFromTemplate(template);
        let args: string[] = [];
        let retVals: string[] = [];

        line = line.slice(template.length, line.length + 1).trim();

        try {
            // Tokenize rest of expression;
            const tokens: Token[] = this.Tokenize(line);
            // Create hierarchical tree based on the parenthesis.
            const tree: ParseTree = ParseTree.CreateTree(tokens).Compact();

            const parsedArgs: ParseTree[] = tree.GetArgTrees();
            const parsedReturns: ParseTree = tree.GetReturnTree();

            args = parsedArgs
                .map((a) => this.GetArgNameFromArgTree(a));

            retVals = this.GetArgTypeFromReturnTree(parsedReturns);

        } catch (err) {
            args = [];
            retVals = [];
        }

        const cppGenerator: IDocGen = new Generator(
            this.activeEditor,
            this.activeSelection,
            args,
            templateArgs,
            retVals,
        );
        return cppGenerator;
    }

    /***************************************************************************
                                    Implementation
     ***************************************************************************/
    protected getLogicalLine(): string {
        let logicalLine: string = "";

        let nextLine: Position = new Position(this.activeSelection.line + 1, this.activeSelection.character);

        let nextLineTxt: string = this.activeEditor.document.lineAt(nextLine.line).text.trim();

        // VSCode may enter a * on itself, we don"t want that in our method
        if (nextLineTxt === "*") {
            nextLineTxt = "";
        }

        while (nextLineTxt.length === 0) { // Get first method line
            nextLine = new Position(nextLine.line + 1, nextLine.character);
            nextLineTxt = this.activeEditor.document.lineAt(nextLine.line).text.trim();
        }

        logicalLine += nextLineTxt;

        // Get method end line
        while (nextLineTxt.indexOf(";") === -1 && nextLineTxt.indexOf("{") === -1) { // Check for method end
            nextLine = new Position(nextLine.line + 1, nextLine.character);
            nextLineTxt = this.activeEditor.document.lineAt(nextLine.line).text.trim();

            logicalLine += " " + nextLineTxt;
        }

        logicalLine = logicalLine.replace(/[{|;]$/, "").trim();

        return logicalLine;
    }

    private Tokenize(expression: string): Token[] {
        const tokens: Token[] = [];
        expression = expression.trim();

        while (expression.length !== 0) {
            const matches: Token[] = Object.keys(this.lexerVocabulary)
                .map((k): Token => new Token(TokenType[k], this.lexerVocabulary[k](expression)))
                .filter((t) => t.Value !== undefined);

            if (matches.length === 0) {
                throw new Error("Next token couldn\'t be determined: " + expression);
            } else if (matches.length > 1) {
                throw new Error("Multiple matches for next token: " + expression);
            }

            const match = matches[0];
            tokens.push(match);
            expression = expression.slice(match.Value.length, expression.length).trim();
        }

        return tokens;
    }

    private GetArgNameFromArgTree(tree: ParseTree): string {
        const hasEllipsis: boolean = tree.nodes
            .filter((n) => n instanceof Token && n.Type === TokenType.Ellipsis)
            .length > 0;

        const indexTrailingReturn: number = tree.nodes
            .findIndex((t) => t instanceof Token ? t.Type === TokenType.Arrow : false);

        const isFuncPtr: boolean = tree.nodes
            .slice(0, indexTrailingReturn === -1 ? tree.nodes.length : indexTrailingReturn)
            .filter((n) => n instanceof ParseTree)
            .length === 2;

        // If it is a function pointer the name is in the first tree.
        if (isFuncPtr === true) {
            const nestedTokens: Token[] = tree.nodes
                .filter((n) => n instanceof ParseTree)
                .map((n) => n as ParseTree)[0]
                .nodes
                .filter((n) => n instanceof Token)
                .map((n) => n as Token)
                .filter((t) => t.Type === TokenType.Symbol)
                .filter((t) => this.keywords.find((k) => k === t.Value) === undefined);

            return nestedTokens[0].Value;
        }

        const tokens: Token[] = tree.nodes
            .filter((n) => n instanceof Token)
            .map((n) => n as Token)
            .filter((t) => t.Type === TokenType.Symbol)
            .filter((t) => this.keywords.find((k) => k === t.Value) === undefined);

        if (tokens.length === 0 && hasEllipsis === true) {
            return "...";
        }

        if (tokens.length < 2) {
            return "";
        }

        return tokens[1].Value;
    }

    private GetArgTypeFromReturnTree(tree: ParseTree): string[] {
        // First strip out the param name or function name since it's not part of the type.
        const indexTrailingReturn: number = tree.nodes
            .findIndex((t) => t instanceof Token ? t.Type === TokenType.Arrow : false);

        const isFuncPtr: boolean = tree.nodes
            .slice(0, indexTrailingReturn === -1 ? tree.nodes.length : indexTrailingReturn)
            .filter((n) => n instanceof ParseTree)
            .length === 2;

        let treeToModify: ParseTree = tree;
        let symbolsFound = 0;
        // If it is a function pointer the name is in the first tree.
        if (isFuncPtr === true) {
            treeToModify = tree.nodes
                .filter((n) => n instanceof ParseTree)
                .map((n) => n as ParseTree)[0];

            // Function pointer so delete the first symbol in the tree
            // Fake that one symbol was found.
            symbolsFound = 1;
        } else {
            // Check for special case if return type is boolean or void.
            for (const token of treeToModify.nodes) {
                if (token instanceof ParseTree) {
                    break;
                }
                if (token.Type !== TokenType.Symbol) {
                    continue;
                }

                if (token.Value === "bool") {
                    return ["true", "false"];
                } else if (token.Value === "void") {
                    return [];
                }
            }
        }

        for (let i = 0; i < treeToModify.nodes.length; i++) {
            const node = treeToModify.nodes[i];
            if (node instanceof ParseTree) {
                break;
            }

            if (node instanceof Token
                && node.Type === TokenType.Symbol
                && this.keywords.find((k) => k === node.Value) === undefined
            ) {
                symbolsFound++;
            }

            if (symbolsFound === 2) {
                treeToModify.nodes.splice(i, 1);
                break;
            }
        }

        return [tree.ToString()];
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
        template = template.slice(template.indexOf("<") + 1, template.lastIndexOf(">")).trim() + ",";

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
                args.push(template.slice(lastSeparator + 1, i).trim());
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

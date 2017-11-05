import { Token, TokenType } from "./Token";

export class ParseTree {

    /**
     * Create a tree from tokens. This consumes the tokens.
     * @param tokens The tokens to create a tree for.
     * @param inNested If currently allready nesting.
     */
    public static CreateTree(tokens: Token[], inNested: boolean = false): ParseTree {
        const tree: ParseTree = new ParseTree();

        while (tokens.length > 0) {
            const token: Token = tokens.shift();
            switch (token.Type) {
                case TokenType.OpenParenthesis:
                    tree.nodes.push(this.CreateTree(tokens, true));
                    break;
                case TokenType.CloseParenthesis:
                    if (inNested === false) {
                        throw new Error("Unmatched closing parenthesis.");
                    }
                    return tree;
                default:
                    tree.nodes.push(token);
                    break;
            }
        }

        if (inNested === true) {
            throw new Error("No match found for an opening parenthesis.");
        }

        return tree;
    }

    public nodes: Array<Token | ParseTree> = [];

    /**
     * Compact empty branches. Example ((foo))(((bar))) will become (foo)(bar)
     * @param tree The ParseTree to compact. Defaults to the current tree.
     */
    public Compact(tree: ParseTree = this): ParseTree {
        const newTree: ParseTree = new ParseTree();
        newTree.nodes = tree.nodes.map((n) => n);
        const isNotCompact = (n) => n instanceof ParseTree && n.nodes.length === 1 && n.nodes[0] instanceof ParseTree;

        // Compact current level of nodes to the maximum amount.
        while (newTree.nodes.some((n) => isNotCompact(n))) {
            newTree.nodes = newTree.nodes
                .map((n) =>  n instanceof ParseTree && isNotCompact(n) ? n.nodes[0] : n);
        }

        // Compact all nested parsetrees.
        newTree.nodes = newTree.nodes
            .map((n) => n instanceof ParseTree ? this.Compact(n) : n);

        return newTree;
    }

    /**
     * Copy parsetree.
     * @param tree The ParseTree to compact. Defaults to the current tree.
     */
    public Copy(tree: ParseTree = this): ParseTree {
        const newTree: ParseTree = new ParseTree();
        newTree.nodes = tree.nodes
            .map((n) => n instanceof Token ? n : this.Copy(n));
        return newTree;
    }

    /**
     * Create string from the parsetree which is a representation of the original code.
     * @param tree The ParseTree to compact. Defaults to the current tree.
     */
    public Yield(tree: ParseTree = this): string {
        let code: string = "";

        for (const node of tree.nodes) {
            if (node instanceof ParseTree) {
                code += "(" + this.Yield(node) + ")";
                continue;
            }

            switch (node.Type) {
                case TokenType.Symbol:
                    code += code === "" ? node.Value : " " + node.Value;
                    break;
                case TokenType.Pointer:
                    code += node.Value;
                    break;
                case TokenType.Reference:
                    code += node.Value;
                    break;
                case TokenType.ArraySubscript:
                    code += node.Value;
                    break;
                case TokenType.CurlyBlock:
                    code += node.Value;
                    break;
                case TokenType.Assignment:
                    code += " " + node.Value;
                    break;
                case TokenType.Comma:
                    code += node.Value;
                    break;
                case TokenType.Arrow:
                    code += " " + node.Value;
                    break;
                case TokenType.Ellipsis:
                    code += node.Value;
                    break;
                case TokenType.Attribute:
                    code += code === "" ? node.Value : " " + node.Value;
                    break;
            }
        }

        return code;
    }
}

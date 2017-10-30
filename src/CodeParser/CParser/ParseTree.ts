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

        // Compact all nested parsetrees and filter out empty branches.
        newTree.nodes = newTree.nodes
            .map((n) => n instanceof ParseTree ? this.Compact(n) : n);

        return newTree;
    }

    /**
     * Create string from the parsetree which is a representation of the original code.
     */
    public ToString(tree: ParseTree = this): string {
        let code: string = "";

        for (const node of tree.nodes) {
            if (node instanceof ParseTree) {
                code += "(" + this.ToString(node) + ")";
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
                    code += " " + node.Value + " ";
                    break;
                case TokenType.Comma:
                    code += node.Value;
                    break;
                case TokenType.Arrow:
                    code += " " + node.Value + " ";
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

    /**
     * Get the tree for the return.
     */
    public GetReturnTree(): ParseTree {
        const returnTree: ParseTree = new ParseTree();

        const indexTrailingReturn: number = this.nodes
            .findIndex((t) => t instanceof Token ? t.Type === TokenType.Arrow : false);

        const isFuncPtr: boolean = this.nodes
            .slice(0, indexTrailingReturn === -1 ? this.nodes.length : indexTrailingReturn)
            .filter((n) => n instanceof ParseTree)
            .length === 2;

        if (isFuncPtr === true) {
            const trees: ParseTree[] = this.nodes
                .filter((n) => n instanceof ParseTree)
                .map((n) => n as ParseTree);

            // Add left most part to the return tokens.
            for (const node of this.nodes) {
                if (node instanceof ParseTree) {
                    break;
                }
                returnTree.nodes.push(node);
            }

            // add left and right parse tree to return tokens
            const leftTree: ParseTree = new ParseTree();
            for (const node of trees[0].nodes) {
                if (node instanceof ParseTree) {
                    break;
                }
                leftTree.nodes.push(node);
            }

            returnTree.nodes.push(leftTree);
            returnTree.nodes.push(trees[1]);
        } else if (indexTrailingReturn !== -1) {
            returnTree.nodes = this.nodes
                .slice(indexTrailingReturn + 1, this.nodes.length);

            // Don't include the auto so start from index 1.
            for (let i: number = 1; i < this.nodes.length; i++) {
                if (this.nodes[i] instanceof ParseTree) {
                    break;
                }
                returnTree.nodes.push(this.nodes[i]);
            }
        } else {
            for (const node of this.nodes) {
                if (node instanceof ParseTree) {
                    break;
                }
                returnTree.nodes.push(node);
            }
        }

        return returnTree;
    }

    /**
     * Get the arguments of the function and create a new ParseTree for each one.
     */
    public GetArgTrees(): ParseTree[] {
        const args: ParseTree[] = [];

        const indexTrailingReturn: number = this.nodes
            .findIndex((t) => t instanceof Token ? t.Type === TokenType.Arrow : false);

        const isFuncPtr: boolean = this.nodes
            .slice(0, indexTrailingReturn === -1 ? this.nodes.length : indexTrailingReturn)
            .filter((n) => n instanceof ParseTree)
            .length === 2;

        let argsTree: ParseTree = this.nodes
            .filter((n) => n instanceof ParseTree)
            .map((t) => t as ParseTree)[0];

        // If it is a func ptr get the nested tree.
        if (isFuncPtr === true) {
            argsTree = argsTree.nodes
                .filter((n) => n instanceof ParseTree)
                .map((t) => t as ParseTree)[0];
        }

        if (argsTree === undefined) {
            throw new Error("Couldn't find arguments tree");
        }

        // split args at command and create a tree for each one.
        let lastComma: number = 0;
        for (let i = 0; i < argsTree.nodes.length; i++) {
            const node = argsTree.nodes[i];
            if (node instanceof Token && node.Type === TokenType.Comma) {
                const tree: ParseTree = new ParseTree();
                tree.nodes = argsTree.nodes.slice(lastComma, i);
                args.push(tree);
                lastComma = i + 1;
            }
        }

        const lastArgTree: ParseTree = new ParseTree();
        lastArgTree.nodes = argsTree.nodes.slice(lastComma, argsTree.nodes.length);
        if (lastArgTree.nodes.length > 0) {
            args.push(lastArgTree);
        }

        return args;
    }
}

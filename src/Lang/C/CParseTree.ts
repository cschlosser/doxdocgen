import { CToken, CTokenType } from "./CToken";

export class CParseTree {

    /**
     * Create a tree from CTokens. This consumes the CTokens.
     * @param CTokens The CTokens to create a tree for.
     * @param inNested If currently allready nesting.
     */
    public static CreateTree(CTokens: CToken[], inNested: boolean = false): CParseTree {
        const tree: CParseTree = new CParseTree();

        while (CTokens.length > 0) {
            const token: CToken = CTokens.shift();
            switch (token.type) {
                case CTokenType.OpenParenthesis:
                    tree.nodes.push(this.CreateTree(CTokens, true));
                    break;
                case CTokenType.CloseParenthesis:
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

    public nodes: Array<CToken | CParseTree> = [];

    /**
     * Compact empty branches. Example ((foo))(((bar))) will become (foo)(bar)
     * @param tree The CParseTree to compact. Defaults to the current tree.
     */
    public Compact(tree: CParseTree = this): CParseTree {
        const newTree: CParseTree = new CParseTree();
        newTree.nodes = tree.nodes.map((n) => n);
        const isNotCompact = (n) => n instanceof CParseTree && n.nodes.length === 1 && n.nodes[0] instanceof CParseTree;

        // Compact current level of nodes to the maximum amount.
        while (newTree.nodes.some((n) => isNotCompact(n))) {
            newTree.nodes = newTree.nodes
                .map((n) =>  n instanceof CParseTree && isNotCompact(n) ? n.nodes[0] : n);
        }

        // Compact all nested CParseTrees.
        newTree.nodes = newTree.nodes
            .map((n) => n instanceof CParseTree ? this.Compact(n) : n);

        return newTree;
    }

    /**
     * Copy CParseTree.
     * @param tree The CParseTree to compact. Defaults to the current tree.
     */
    public Copy(tree: CParseTree = this): CParseTree {
        const newTree: CParseTree = new CParseTree();
        newTree.nodes = tree.nodes
            .map((n) => n instanceof CToken ? n : this.Copy(n));
        return newTree;
    }

    /**
     * Create string from the CParseTree which is a representation of the original code.
     * @param tree The CParseTree to compact. Defaults to the current tree.
     */
    public Yield(tree: CParseTree = this): string {
        let code: string = "";

        for (const node of tree.nodes) {
            if (node instanceof CParseTree) {
                code += "(" + this.Yield(node) + ")";
                continue;
            }

            switch (node.type) {
                case CTokenType.Symbol:
                    code += code === "" ? node.value : " " + node.value;
                    break;
                case CTokenType.Pointer:
                    code += node.value;
                    break;
                case CTokenType.Reference:
                    code += node.value;
                    break;
                case CTokenType.ArraySubscript:
                    code += node.value;
                    break;
                case CTokenType.CurlyBlock:
                    code += node.value;
                    break;
                case CTokenType.Assignment:
                    code += " " + node.value;
                    break;
                case CTokenType.Comma:
                    code += node.value;
                    break;
                case CTokenType.Arrow:
                    code += " " + node.value;
                    break;
                case CTokenType.Ellipsis:
                    code += node.value;
                    break;
                case CTokenType.Attribute:
                    code += code === "" ? node.value : " " + node.value;
                    break;
            }
        }

        return code;
    }
}

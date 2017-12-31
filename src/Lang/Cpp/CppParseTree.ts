import { CppToken, CppTokenType } from "./CppToken";

export class CppParseTree {

    /**
     * Create a tree from CppTokens. This consumes the CppTokens.
     * @param CppTokens The CppTokens to create a tree for.
     * @param inNested If currently allready nesting.
     */
    public static CreateTree(CppTokens: CppToken[], inNested: boolean = false): CppParseTree {
        const tree: CppParseTree = new CppParseTree();

        while (CppTokens.length > 0) {
            const token: CppToken = CppTokens.shift();
            switch (token.type) {
                case CppTokenType.OpenParenthesis:
                    tree.nodes.push(this.CreateTree(CppTokens, true));
                    break;
                case CppTokenType.CloseParenthesis:
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

    public nodes: Array<CppToken | CppParseTree> = [];

    /**
     * Compact empty branches. Example ((foo))(((bar))) will become (foo)(bar)
     * @param tree The CppParseTree to compact. Defaults to the current tree.
     */
    public Compact(tree: CppParseTree = this): CppParseTree {
        const newTree: CppParseTree = new CppParseTree();
        newTree.nodes = tree.nodes.map((n) => n);
        const isNotCompact = (n) => {
            return n instanceof CppParseTree
                && n.nodes.length === 1 && n.nodes[0] instanceof CppParseTree;
        };

        // Compact current level of nodes to the maximum amount.
        while (newTree.nodes.some((n) => isNotCompact(n))) {
            newTree.nodes = newTree.nodes
                .map((n) =>  n instanceof CppParseTree && isNotCompact(n) ? n.nodes[0] : n);
        }

        // Compact all nested CppParseTrees.
        newTree.nodes = newTree.nodes
            .map((n) => n instanceof CppParseTree ? this.Compact(n) : n);

        return newTree;
    }

    /**
     * Copy CppParseTree.
     * @param tree The CppParseTree to compact. Defaults to the current tree.
     */
    public Copy(tree: CppParseTree = this): CppParseTree {
        const newTree: CppParseTree = new CppParseTree();
        newTree.nodes = tree.nodes
            .map((n) => n instanceof CppToken ? n : this.Copy(n));
        return newTree;
    }

    /**
     * Create string from the CppParseTree which is a representation of the original code.
     * @param tree The CppParseTree to compact. Defaults to the current tree.
     */
    public Yield(tree: CppParseTree = this): string {
        let code: string = "";

        for (const node of tree.nodes) {
            if (node instanceof CppParseTree) {
                code += "(" + this.Yield(node) + ")";
                continue;
            }

            switch (node.type) {
                case CppTokenType.Symbol:
                    code += code === "" ? node.value : " " + node.value;
                    break;
                case CppTokenType.Pointer:
                    code += node.value;
                    break;
                case CppTokenType.Reference:
                    code += node.value;
                    break;
                case CppTokenType.ArraySubscript:
                    code += node.value;
                    break;
                case CppTokenType.CurlyBlock:
                    code += node.value;
                    break;
                case CppTokenType.Assignment:
                    code += " " + node.value;
                    break;
                case CppTokenType.Comma:
                    code += node.value;
                    break;
                case CppTokenType.Arrow:
                    code += " " + node.value;
                    break;
                case CppTokenType.Ellipsis:
                    code += node.value;
                    break;
                case CppTokenType.Attribute:
                    code += code === "" ? node.value : " " + node.value;
                    break;
            }
        }

        return code;
    }
}

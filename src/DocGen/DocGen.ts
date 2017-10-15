import { Range } from "vscode";

export interface IDocGen {
    /**
     * @brief Generate documentation string and write it to the active editor
     * @param {Range} rangeToReplace Range to replace with the generated comment.
     */
    GenerateDoc(rangeToReplace: Range);
}

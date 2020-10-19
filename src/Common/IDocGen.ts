import { Range } from "vscode";
import GitConfig from "../GitConfig";

export interface IDocGen {
    /**
     * @brief Generate documentation string and write it to the active editor
     * @param {Range} rangeToReplace Range to replace with the generated comment.
     */
    GenerateDoc(rangeToReplace: Range, gitConfig: GitConfig);
}

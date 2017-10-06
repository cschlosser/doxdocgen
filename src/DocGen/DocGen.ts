/**
 * Contains the supported doxygen commands
 *
 * @export
 * @enum {number}
 */
export enum DoxygenCommands {
    brief = "brief",
    return = "return",
    param = "param",
    detailed = "(Detailed description)",
}

export interface IDocGen {
    /**
     * Generate documentation string and write it to the active editor
     */
    GenerateDoc();
}

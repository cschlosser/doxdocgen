import { CppParseTree } from "./CppParseTree";

export class CppArgument {
    public name: string = null;
    public type: CppParseTree = new CppParseTree();

    /**
     * @returns  the argument name string
     */
    public getNameString(): string {
        return this.name !== null ? this.name : "";
    }

    /**
     * @returns the argument type string
     */
    public getTypeString(): string {
        return this.type.Yield();
    }
}

import { CppParseTree } from "./CppParseTree";

export class CppArgument {
    public name: string = null;
    public type: CppParseTree =  new CppParseTree();
}

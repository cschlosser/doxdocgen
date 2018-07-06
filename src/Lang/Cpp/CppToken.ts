export enum CppTokenType {
    Symbol,
    Pointer,
    Reference,
    ArraySubscript,
    OpenParenthesis,
    CloseParenthesis,
    CurlyBlock,
    Assignment,
    Comma,
    Arrow,
    CommentBlock,
    CommentLine,
    Ellipsis,
    Attribute,
    MemberPointer,
}

export class CppToken {
    public type: CppTokenType;
    public value: string;

    constructor(type: CppTokenType, value: string) {
        this.type = type;
        this.value = value;
    }
}

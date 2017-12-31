export enum CTokenType {
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
}

export class CToken {
    public type: CTokenType;
    public value: string;

    constructor(type: CTokenType, value: string) {
        this.type = type;
        this.value = value;
    }
}

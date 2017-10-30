export enum TokenType {
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
    Ellipsis,
    Attribute,
}

export class Token {
    public Type: TokenType;
    public Value: string;

    constructor(type: TokenType, value: string) {
        this.Type = type;
        this.Value = value;
    }
}

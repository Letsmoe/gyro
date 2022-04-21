import { InputStream } from "./input-stream.js";
declare class TokenStream {
    private stream;
    private KEYWORDS;
    private current;
    constructor(stream: InputStream);
    private isKeyword;
    private isDigit;
    private isIdentifierStart;
    private isIdentifier;
    private isOperatorChar;
    private isPunctuation;
    private isWhitespace;
    private readWhile;
    private readNumber;
    private readIdentifier;
    private readEscaped;
    private readString;
    private skipComment;
    private readNext;
    peek(): any;
    next(): any;
    eof(): boolean;
    croak(msg: string): void;
    all(): any[];
}
export { TokenStream };

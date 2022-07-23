interface ASTToken {
    elements?: any;
    type: string;
    value?: any;
    left?: ASTToken;
    operator?: ASTToken;
    right?: ASTToken;
    name?: string;
    vars?: ASTToken[];
    body?: ASTToken[];
    cond?: ASTToken;
    then?: ASTToken;
    else?: ASTToken;
}
declare function compileToJavascript(exp: ASTToken): string;
export { compileToJavascript };

interface ASTToken {
    elements: any;
    type: string;
    value: any;
    left?: ASTToken;
    operator?: ASTToken;
    right?: ASTToken;
    name?: string;
    vars?: string[];
    body?: ASTToken;
    cond?: ASTToken;
    then?: ASTToken;
    else?: ASTToken;
}
declare function compileJS(exp: ASTToken): string;
export { compileJS };

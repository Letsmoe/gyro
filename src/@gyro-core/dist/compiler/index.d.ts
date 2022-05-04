declare class Compiler {
    private readonly ast;
    private output;
    constructor(ast: any);
    compile(): string;
    private compilePart;
    private compileProgram;
    private compileBinaryExpression;
}
export { Compiler };

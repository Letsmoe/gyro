/**
 * BinaryExpression - +
 * 		-> number - 5
 * 		-> BinaryExpression - *
 * 			-> number - 6
 * 			-> number - 7
 * -> 47
 *
 * mov DWORD [rbp-4], 6
 * mov DWORD [rbp-8], 7
 * mov eax, DWORD [rbp-8]
 * imul edx, eax, DWORD [rbp-4]
 * mov DWORD [rbp-12], 5
 * add eax, edx, DWORD [rbp-12]
 *
 * => eax == 47 // True
 */
declare class Compiler {
    private readonly ast;
    content: string;
    private s_offset;
    private localAssignments;
    private v_lookup;
    private indent;
    constructor(ast: any);
    compile(): string;
    private emit_program;
    private emit_move;
    emit_expr(expr: any): {
        type: string;
        value: any;
    };
    emit_toint(expr: any): void;
    /**
     * Push the value of the specified registry into the stack.
     * @date 5/4/2022 - 3:05:56 PM
     *
     * @public
     * @param {string} reg
     */
    push(reg: string): void;
    /**
     * Pop the top most element of the stack into the specified registry.
     * @date 5/4/2022 - 3:05:30 PM
     *
     * @public
     * @param {string} reg
     */
    pop(reg: string): void;
    /**
     * Write an expression into the local content.
     * @date 5/4/2022 - 3:07:29 PM
     *
     * @public
     * @param {string} str
     */
    emit(str: string): void;
}
export { Compiler };

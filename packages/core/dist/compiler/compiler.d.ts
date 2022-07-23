import { ResultType } from "./types.js";
declare class Compiler {
    private readonly ast;
    content: string[];
    private labelOffset;
    private s_offset;
    private localAssignments;
    private v_lookup;
    private indent;
    constructor(ast: any);
    compile(): string;
    getLines(): string[][];
    private emit_program;
    private emit_move;
    emit_expr(expr: any, typeConversion?: string, lastExpression?: any): {
        type: ResultType;
        value: any;
    };
    emit_toint(expr: any): void;
    emit_label(label: string): void;
    private emit_function;
    private handleTypeExpression;
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

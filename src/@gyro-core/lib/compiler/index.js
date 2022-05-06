const error = (...args) => {
    process.stderr.write(`${args.join(' ')}\n`);
    process.exit(1);
};
const REGS = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];
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
class Compiler {
    constructor(ast) {
        this.ast = ast;
        this.content = "";
        // Stack pointer offset
        this.s_offset = 0;
        // Number of assignments in the current scope for adjusting rbp offsets
        this.localAssignments = 0;
        // Variable name lookup table
        this.v_lookup = {};
        this.indent = 0;
    }
    compile() {
        this.emit("global _start");
        this.emit("_start:");
        this.indent++;
        this.emit("mov rbp, rsp");
        this.emit_program(this.ast);
        return this.content;
    }
    emit_program(expr) {
        expr.body.forEach(this.emit_expr, this);
    }
    emit_move(reg, expr) {
        if (expr) {
            if (expr.type === "IDENTIFIER_RBP_OFFSET") {
                this.emit(`mov ${reg}, DWORD [rbp-${expr.value}]`);
            }
            else if (expr.type === "LITERAL") {
                this.emit(`mov ${reg}, ${expr.value}`);
            }
        }
    }
    emit_expr(expr) {
        const t = expr.type;
        if (t === "number") {
            // We're dealing with ints, we can use the register-base-pointer (rbp) and offset the values into the stack, we can assume it has already been pushed into the stack before.
            // Increment the base pointer by 4, which means 32 bits or 4 bytes.
            return {
                type: "LITERAL",
                value: expr.value
            };
        }
        else if (t === "BinaryExpression") {
            // Emit expressions for our left and right operands and get possible rbp offsets from them.
            // If an offset is `null` we can assume that a calculation has been performed and the result will exist in `edx` 
            let leftOffset = this.emit_expr(expr.left);
            let rightOffset = this.emit_expr(expr.right);
            let op = null;
            switch (expr.operator) {
                case "+":
                    op = "add";
                    break;
                case "*":
                    op = "imul";
                    break;
                case "/":
                    // TODO: Use AND for known powers of 2 when dividing or calculating the remainder to optimize performance. (https://stackoverflow.com/questions/8021772/assembly-language-how-to-do-modulo)
                    this.emit_move("eax", leftOffset);
                    this.emit_move("edx", rightOffset);
                    this.emit("idiv edx");
                    break;
                case "%":
                    this.emit_move("eax", leftOffset);
                    this.emit_move("edx", rightOffset);
                    this.emit("idiv edx");
                    this.emit("mov eax, edx");
                    break;
            }
            if (op !== null) {
                this.emit_move("edx", leftOffset);
                this.emit_move("eax", rightOffset);
                this.emit(`${op} eax, edx`);
            }
            return {
                type: "RESULT_IN_EAX",
                value: "eax"
            };
        }
        else if (t === "AssignmentExpression") {
            // Emit expressions for our left and right operands and get possible rbp offsets from them.
            // If an offset is `null` we can assume that a calculation has been performed and the result will exist in `edx`
            // Increment the offset and write into the lookup table
            let value = this.emit_expr(expr.right);
            if (!this.v_lookup.hasOwnProperty(expr.left.value)) {
                this.localAssignments++;
                this.s_offset += 4;
                this.v_lookup[expr.left.value] = this.s_offset;
            }
            if (value.type === "IDENTIFIER_RBP_OFFSET") {
                this.emit(`mov DWORD [rbp-${this.s_offset}], [rbp-${value.value}]`);
            }
            else {
                this.emit(`mov DWORD [rbp-${this.s_offset}], ${value.value}`);
            }
        }
        else if (t === "Identifier") {
            // We're dealing with a variable, we can use the lookup table to get the offset of the variable and then use that to access the stack.
            if (!this.v_lookup.hasOwnProperty(expr.value)) {
                error("Looking up variable in scope failed for: " + expr.value);
            }
            else {
                return {
                    type: "IDENTIFIER_RBP_OFFSET",
                    value: this.v_lookup[expr.value]
                };
            }
        }
        else {
            error(`Compilation failed for type: ${expr.type}`);
        }
    }
    emit_toint(expr) {
        this.emit("cvttsd2si xmm0, eax");
    }
    /**
     * Push the value of the specified registry into the stack.
     * @date 5/4/2022 - 3:05:56 PM
     *
     * @public
     * @param {string} reg
     */
    push(reg) {
        this.emit(`push ${reg}`);
    }
    /**
     * Pop the top most element of the stack into the specified registry.
     * @date 5/4/2022 - 3:05:30 PM
     *
     * @public
     * @param {string} reg
     */
    pop(reg) {
        this.emit(`pop ${reg}`);
    }
    /**
     * Write an expression into the local content.
     * @date 5/4/2022 - 3:07:29 PM
     *
     * @public
     * @param {string} str
     */
    emit(str) {
        this.content += "\t".repeat(this.indent) + str + "\n";
    }
}
export { Compiler };

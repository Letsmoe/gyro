import { error } from "./error.js";
import { Register, ResultType } from "./types.js";

class Compiler {
	public content: string[] = [];
	private labelOffset: number = 0;
	// Stack pointer offset
	private s_offset: number = 0;
	// Number of assignments in the current scope for adjusting rbp offsets
	private localAssignments: number = 0;
	// Variable name lookup table
	private v_lookup: { [key: string]: { ctype: string; offset: number } } = {};
	private indent = 0;
	constructor(private readonly ast: any) {}

	public compile(): string {
		this.emit('%include "printnum.asm"');
		this.emit("section .text");
		this.indent++;
		this.emit("global _start");
		this.emit("_start:");
		this.indent++;
		this.emit("mov rbp, rsp");
		this.emit_program(this.ast);
		this.emit("mov rax, 60");
		this.emit("mov rdi, 0");
		this.emit("syscall");
		return this.content.join("\n");
	}

	public getLines() {
		return this.content.map((x) => x.split("\n").map((y) => y.trim()));
	}

	private emit_program(expr: { body: any[] }) {
		expr.body.forEach((e) => {
			this.emit_expr(e);
		});
	}

	private emit_move(reg: Register, expr: { type: ResultType; value: any }) {
		if (expr) {
			let positive = expr.value.offset >= 0 ? "+" : "";
			if (expr.type === ResultType.RBP_OFFSET) {
				this.emit(
					`mov ${reg}, DWORD [rbp${positive}${expr.value.offset}]`
				);
			} else if (expr.type === ResultType.LITERAL) {
				this.emit(`mov ${reg}, ${expr.value}`);
			} else if (expr.type === ResultType.REGISTER) {
				if (expr.value === reg) {
					return;
				}
				this.emit(`mov ${reg}, ${expr.value}`);
			}
		}
	}

	public emit_expr(
		expr: any,
		typeConversion: string = null,
		lastExpression: any = null
	) {
		const t = expr.type;
		if (t === "CallExpression") {
			for (const arg of expr.args.reverse()) {
				let result = this.emit_expr(arg);
				if (typeof result.value === "object") {
					this.emit_move("eax", {
						value: result.value,
						type: ResultType.RBP_OFFSET,
					});
				} else {
					this.push(result.value);
				}
				this.s_offset -= 4;
			}
			this.emit("call " + expr.callee.value);
			return { type: ResultType.REGISTER, value: "eax" };
		} else if (t === "ReturnExpression") {
			let result = this.emit_expr(expr.value);
			this.emit_move("eax", result);
		} else if (t === "FunctionDeclaration") {
			return this.emit_function(expr, lastExpression);
		} else if (t === "integer" || t === "float" || t === "boolean") {
			// We're dealing with ints, we can use the register-base-pointer (rbp) and offset the values into the stack, we can assume it has already been pushed into the stack before.
			// Increment the base pointer by 4, which means 32 bits or 4 bytes.
			return {
				type: ResultType.LITERAL,
				value: expr.value,
			};
		} else if (t === "BinaryExpression") {
			// Emit expressions for our left and right operands and get possible rbp offsets from them.
			// If an offset is `null` we can assume that a calculation has been performed and the result will exist in `edx`
			let leftOffset = this.emit_expr(expr.left);
			let rightOffset = this.emit_expr(expr.right);
			let op: string = null;
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
				case "-":
					this.emit_move("eax", leftOffset);
					this.emit_move("edx", rightOffset);
					this.emit("sub eax, edx");
					break;
			}

			if (op !== null) {
				this.emit_move("edx", leftOffset);
				this.emit_move("eax", rightOffset);
				this.emit(`${op} eax, edx`);
			}

			return {
				type: ResultType.REGISTER,
				value: "eax",
			};
		} else if (t === "AssignmentExpression") {
			// Emit expressions for our left and right operands and get possible rbp offsets from them.
			// If an offset is `null` we can assume that a calculation has been performed and the result will exist in `edx`
			// Increment the offset and write into the lookup table.
			let vName: string = expr.left.value;
			let type: string = "any";
			if (expr.left.type === "TypeExpression") {
				vName = expr.left.left.value;
				type = expr.left.right.value;
			}

			let variable = this.emit_expr(expr.right, type, expr);

			if (!this.v_lookup.hasOwnProperty(vName)) {
				this.localAssignments++;
				this.s_offset -= 4;
				this.v_lookup[vName] = {
					ctype: type,
					offset: this.s_offset,
				};
			}
			let positive = this.s_offset >= 0 ? "+" : "";

			if (variable.type === ResultType.RBP_OFFSET) {
				this.emit(
					`mov DWORD [rbp${positive}${this.s_offset}], [rbp${positive}${variable.value.offset}]`
				);
			} else if (variable.type !== ResultType.LABEL) {
				this.emit(
					`mov DWORD [rbp${positive}${this.s_offset}], ${variable.value}`
				);
			}
		} else if (t === "Identifier") {
			// We're dealing with a variable, we can use the lookup table to get the offset of the variable and then use that to access the stack.
			if (!this.v_lookup.hasOwnProperty(expr.value)) {
				error("Looking up variable in scope failed for: " + expr.value);
			} else {
				return {
					type: ResultType.RBP_OFFSET,
					value: this.v_lookup[expr.value],
				};
			}
		} else {
			error(`Compilation failed for type: ${expr.type}`);
		}
	}

	public emit_toint(expr: any) {
		this.emit("cvttsd2si xmm0, eax");
	}

	public emit_label(label: string) {
		this.indent--;
		this.emit(`${label}:`);
		this.indent++;
	}

	private emit_function(expr: any, last: any) {
		this.localAssignments = 2;
		this.s_offset = 16;
		this.labelOffset++;
		this.emit_label(last.left.left.value);
		this.emit("mov rbp, rsp");
		for (const arg of expr.vars) {
			let [name, type] = this.handleTypeExpression(arg);
			this.v_lookup[name] = {
				ctype: type,
				offset: this.s_offset,
			};
			this.localAssignments++;
			this.s_offset += 8;
		}
		this.s_offset -= this.localAssignments * 8;
		this.emit_program(expr.body);
		this.emit("ret");
		this.labelOffset--;
		return { type: ResultType.LABEL, value: last.left.left.value };
	}

	private handleTypeExpression(expr: any) {
		if (expr.type === "TypeExpression") {
			return [expr.left.value, expr.right.value];
		} else {
			return [expr.value, "any"];
		}
	}

	/**
	 * Push the value of the specified registry into the stack.
	 * @date 5/4/2022 - 3:05:56 PM
	 *
	 * @public
	 * @param {string} reg
	 */
	public push(reg: string) {
		this.emit(`push ${reg}`);
	}

	/**
	 * Pop the top most element of the stack into the specified registry.
	 * @date 5/4/2022 - 3:05:30 PM
	 *
	 * @public
	 * @param {string} reg
	 */
	public pop(reg: string) {
		this.emit(`pop ${reg}`);
	}

	/**
	 * Write an expression into the local content.
	 * @date 5/4/2022 - 3:07:29 PM
	 *
	 * @public
	 * @param {string} str
	 */
	public emit(str: string) {
		if (!this.content[this.labelOffset]) {
			this.content[this.labelOffset] = "";
		}
		this.content[this.labelOffset] += "\t".repeat(this.indent) + str + "\n";
	}
}

export { Compiler };

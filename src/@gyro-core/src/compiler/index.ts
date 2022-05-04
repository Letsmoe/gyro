class Compiler {
	private output: string = "";
	constructor(private readonly ast: any) {}

	public compile(): string {
		// Compile the program
		this.compilePart(this.ast)
		return this.output;
	}

	private compilePart(expr: any) {
		switch (expr.type) {
			case "BinaryExpression":
				return this.compileBinaryExpression(expr);
			case "Program":
				return this.compileProgram(expr);
			case "number":
				return expr.value;
		}
	}

	private compileProgram(expr: any) {
		expr.body.forEach((subExpression: {}) => {
			this.compilePart(subExpression);
		});
	}

	private compileBinaryExpression(expr: any) {
		let left = this.compilePart(expr.left);
		let right = this.compilePart(expr.right);
		if (expr.operator == "+") {
			this.output += `mov ax, ${left}\nmov bx, ${right}\nadd ax, bx`;
		}
	}
}

export { Compiler }
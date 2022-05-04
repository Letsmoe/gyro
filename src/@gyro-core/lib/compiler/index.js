class Compiler {
    constructor(ast) {
        this.ast = ast;
        this.output = "";
    }
    compile() {
        // Compile the program
        this.compilePart(this.ast);
        return this.output;
    }
    compilePart(expr) {
        switch (expr.type) {
            case "BinaryExpression":
                return this.compileBinaryExpression(expr);
            case "Program":
                return this.compileProgram(expr);
            case "number":
                return expr.value;
        }
    }
    compileProgram(expr) {
        expr.body.forEach((subExpression) => {
            this.compilePart(subExpression);
        });
    }
    compileBinaryExpression(expr) {
        let left = this.compilePart(expr.left);
        let right = this.compilePart(expr.right);
        if (expr.operator == "+") {
            this.output += `mov ax, ${left}\nmov bx, ${right}\nadd ax, bx`;
        }
    }
}
export { Compiler };

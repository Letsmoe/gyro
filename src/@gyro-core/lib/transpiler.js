const FALSE = false;
function compileJS(exp) {
    return "const print = (...args) => console.log(...args);" + js(exp);
    function js(exp) {
        switch (exp.type) {
            case "number":
            case "string":
            case "boolean":
                return doAtom(exp);
            case "ArrayExpression":
                return doArray(exp);
            case "identifier":
                return doIdentifier(exp);
            case "BinaryExpression":
                return doBinaryExpression(exp);
            case "AssignmentExpression":
                return doAssignment(exp);
            case "let":
                return doLetExpression(exp);
            case "FunctionDeclaration":
                return doFunction(exp);
            case "if":
                return doConditional(exp);
            case "Program":
                return doProgram(exp);
            case "CallExpression":
                return doFunctionCall(exp);
            case "ForInStatement":
                return doLoop(exp);
            default:
                throw new Error("Transpilation failed for: " + JSON.stringify(exp));
        }
    }
    function doLoop(exp) {
        if (js(exp.right).startsWith("{")) {
            return `for (let ${js(exp.left)} in ${js(exp.right)}) {
				${js(exp.body)}
			}`;
        }
        else if (js(exp.right).startsWith("[")) {
            // Loop through array
            return `for (let ${js(exp.left)} of ${js(exp.right)}) {
				${js(exp.body)}
			}`;
        }
        else {
            return `for (let ${js(exp.left)} = 0; ${js(exp.left)} < ${js(exp.right)}; ${js(exp.left)}++) {
				${js(exp.body)}
			}`;
        }
    }
    function doArray(exp) {
        return "[" + exp.elements.map(js).join(", ") + "]";
    }
    function doAtom(exp) {
        return JSON.stringify(exp.value); // cheating ;-)
    }
    function make_var(name) {
        return name;
    }
    function doIdentifier(exp) {
        return exp.value;
    }
    function doBinaryExpression(exp) {
        return "(" + js(exp.left) + exp.operator + js(exp.right) + ")";
    }
    // assign nodes are compiled the same as binary
    function doAssignment(exp) {
        return doBinaryExpression(exp);
    }
    function doFunction(exp) {
        var code = "(function ";
        if (exp.name)
            code += make_var(exp.name);
        code += "(" + exp.vars.map(make_var).join(", ") + ") {";
        code += "return " + js(exp.body) + " })";
        return code;
    }
    function doLetExpression(exp) {
        if (exp.vars.length == 0)
            return js(exp.body);
        var iife = {
            type: "call",
            func: {
                type: "lambda",
                vars: [exp.vars[0].name],
                body: {
                    type: "let",
                    vars: exp.vars.slice(1),
                    body: exp.body,
                },
            },
            args: [exp.vars[0].def || FALSE],
        };
        return "(" + js(iife) + ")";
    }
    function doConditional(exp) {
        return ("(" +
            js(exp.cond) +
            " !== false" +
            " ? " +
            js(exp.then) +
            " : " +
            js(exp.else || FALSE) +
            ")");
    }
    function doProgram(exp) {
        return "(" + exp.body.map(js).join(", ") + ")";
    }
    function doFunctionCall(exp) {
        return js(exp.callee) + "(" + exp.args.map(js).join(", ") + ")";
    }
}
export { compileJS };

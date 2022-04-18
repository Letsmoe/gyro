import { Environment } from "./environment.js";
function evaluate(exp, env) {
    switch (exp.type) {
        case "number":
        case "string":
        case "boolean":
            return exp.value;
        case "identifier":
            return env.get(exp.value);
        case "AssignmentExpression":
            if (exp.left.type != "identifier")
                throw new Error("Cannot assign to " + JSON.stringify(exp.left));
            return env.def(exp.left.value, evaluate(exp.right, env));
        case "BinaryExpression":
            return applyOperation(exp.operator, evaluate(exp.left, env), evaluate(exp.right, env));
        case "ForInStatement":
            return makeLoop(env, exp);
        case "FunctionDeclaration":
            return makeFunction(env, exp);
        case "if":
            var cond = evaluate(exp.cond, env);
            if (cond !== false)
                return evaluate(exp.then, env);
            return exp.else ? evaluate(exp.else, env) : false;
        case "Program":
            var val = false;
            exp.body.forEach(function (subExpression) {
                val = evaluate(subExpression, env);
            });
            return val;
        case "CallExpression":
            var func = evaluate(exp.callee, env);
            return func.apply(null, exp.args.map(function (arg) {
                return evaluate(arg, env);
            }));
        case "ArrayExpression":
            // We allow deeply nested arrays, we must recurse to parse them
            return exp.elements.map(function (e) {
                return evaluate(e, env);
            });
        default:
            throw new Error("I don't know how to evaluate " + exp.type);
    }
}
function applyOperation(op, a, b) {
    function num(x) {
        if (typeof x != "number")
            throw new Error("Expected number but got " + x);
        return x;
    }
    function div(x) {
        if (num(x) == 0)
            throw new Error("Divide by zero");
        return x;
    }
    switch (op) {
        case "+":
            return num(a) + num(b);
        case "-":
            return num(a) - num(b);
        case "*":
            return num(a) * num(b);
        case "/":
            return num(a) / div(b);
        case "%":
            return num(a) % div(b);
        case "&&":
            return a !== false && b;
        case "||":
            return a !== false ? a : b;
        case "<":
            return num(a) < num(b);
        case ">":
            return num(a) > num(b);
        case "<=":
            return num(a) <= num(b);
        case ">=":
            return num(a) >= num(b);
        case "==":
            return a === b;
        case "!=":
            return a !== b;
        case "**":
            return Math.pow(a, b);
    }
    throw new Error("Can't apply operator " + op);
}
function makeLoop(env, exp) {
    let localEnv = env.extend();
    let control = exp.left.value;
    let array = evaluate(exp.right, env);
    if (typeof array === "number") {
        for (let i = 0; i < array; i++) {
            localEnv.def(control, i);
            evaluate(exp.body, localEnv);
        }
    }
    else if (Array.isArray(array)) {
        for (const x of array) {
            localEnv.def(control, x);
            evaluate(exp.body, localEnv);
        }
    }
    else {
        for (const key in array) {
            localEnv.def(control, key);
            evaluate(exp.body, localEnv);
        }
    }
}
function makeFunction(env, exp) {
    function lambda() {
        var names = exp.vars;
        var scope = env.extend();
        for (var i = 0; i < names.length; ++i)
            scope.def(names[i], i < arguments.length ? arguments[i] : false);
        return evaluate(exp.body, scope);
    }
    return lambda;
}
export { evaluate, Environment };

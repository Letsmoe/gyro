import { Environment } from "./environment.js";
import { InputStream } from "./input-stream.js";
import { TokenStream } from "./token-stream.js";
import * as fs from "fs";
import { parse } from "./parser.js";
function evaluate(exp, env) {
    switch (exp.type) {
        case "number":
        case "string":
        case "boolean":
            return exp.value;
        case "Identifier":
            return env.get(exp.value);
        case "AssignmentExpression":
            if (exp.left.type != "Identifier") {
                // We're not reassigning a value, check if a type has been annotated.
                if (exp.left.type == "TypeExpression") {
                    // Expect a type to be assigned to the variable. => (varName: type) = value;
                    return env.def(exp.left.left.value, evaluate(exp.right, env));
                }
                else {
                    // We can't assign a value to someone whose type we don't know.
                    throw new Error("Cannot assign to " +
                        JSON.stringify(exp.left) +
                        "with missing type");
                }
            }
            // Expect that the user wishes the `any` type to be assigned automatically.
            return env.def(exp.left.value, evaluate(exp.right, env));
        case "TypeExpression":
            return exp.value;
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
        case "ObjectAccessor":
            return evaluate(exp.left, env)[evaluate(exp.right, env)];
        case "ArrayExpression":
            // We allow deeply nested arrays, we must recurse to parse them
            return exp.elements.map(function (e) {
                return evaluate(e, env);
            });
        case "ImportExpression":
            if (!exp.raw) {
                const input = new InputStream(fs.readFileSync(exp.value, "utf8"));
                const tokens = new TokenStream(input);
                const ast = parse(tokens);
                if (exp.take !== undefined) {
                    let localEnvironment = new Environment(env);
                    evaluate(ast, localEnvironment);
                    for (var str of exp.take) {
                        env.def(str, localEnvironment.get(str));
                    }
                    return env.get(str);
                }
                else {
                    evaluate(ast, env);
                    return;
                }
            }
            else {
                return fs.readFileSync(exp.value, "utf8");
            }
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
        for (var i = 0; i < names.length; ++i) {
            if (names[i].type == "TypeExpression") {
                scope.def(names[i].left.value, i < arguments.length ? arguments[i] : false);
            }
            else {
                scope.def(names[i].value, i < arguments.length ? arguments[i] : false);
            }
        }
        return evaluate(exp.body, scope);
    }
    return lambda;
}
export { evaluate, Environment };

import { InputStream } from "./input-stream.js";
import { TokenStream } from "./token-stream.js";
import { parse } from "./parser.js";
import { evaluate } from "./interpreter.js";
import { compileToJavascript } from "./transpiler.js";
import { Environment } from "./environment.js";
declare const Gyro: {
    evaluate(code: string, env?: Environment): any[];
    evaluateAST(ast: object, env?: Environment): any;
    parse(code: string): {
        type: string;
        body: any[];
    };
    tokenize(code: string): any[];
    compile(code: string): string;
};
export { InputStream, TokenStream, parse, evaluate, compileToJavascript, Environment, Gyro };

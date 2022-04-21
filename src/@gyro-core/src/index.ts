import { InputStream } from "./input-stream.js";
import { TokenStream } from "./token-stream.js";
import { parse } from "./parser.js";
import { evaluate } from "./interpreter.js";
import { compileJS } from "./transpiler.js";
import { Environment } from "./environment.js";

const Gyro = {
	evaluate(code: string, env: Environment = new Environment(null)) {
		const input = new InputStream(code);
		const tokens = new TokenStream(input);
		const ast = parse(tokens);
		return evaluate(ast, env);
	},
	evaluateAST(ast: object, env: Environment = new Environment(null)) {
		return evaluate(ast, env);
	},
	parse(code: string) {
		const input = new InputStream(code);
		const tokens = new TokenStream(input);
		return parse(tokens);
	},
	tokenize(code: string) {
		const input = new InputStream(code);
		const tokens = new TokenStream(input);
		return tokens.all();
	}
}

export { InputStream, TokenStream, parse, evaluate, compileJS, Environment, Gyro };
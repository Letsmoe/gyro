import { TokenStream } from "./token-stream.js";
import { Keyword } from "./types.js"

function parse(input: TokenStream) {
	var PRECEDENCE = {
		":": 1,
		"=": 2,
		"||": 3,
		"&&": 4,
		"<": 7,
		">": 7,
		"<=": 7,
		">=": 7,
		"==": 7,
		"!=": 7,
		"+=": 7,
		"+": 10,
		"-": 10,
		"*": 20,
		"/": 20,
		"%": 20,
		"**": 30,
		"~": 40,
	};
	return parseToplevel();
	function isPunctuation(ch: string) {
		var tok = input.peek();
		return (
			tok && tok.type == "punctuation" && (!ch || tok.value == ch) && tok
		);
	}
	function isKeyword(kw: Keyword) {
		var tok = input.peek();
		return tok && tok.type == "Keyword" && (!kw || tok.value == kw) && tok;
	}
	function isOperator(op?: string) {
		var tok = input.peek();
		return tok && tok.type == "operator" && (!op || tok.value == op) && tok;
	}
	function skipPunctuation(ch) {
		if (isPunctuation(ch)) input.next();
		else input.croak('Expecting punctuation: "' + ch + '"');
	}
	function skipKeyword(kw) {
		if (isKeyword(kw)) input.next();
		else input.croak('Expecting keyword: "' + kw + '"');
	}
	function skipOperator(op) {
		if (isOperator(op)) input.next();
		else input.croak('Expecting operator: "' + op + '"');
	}
	function unexpected() {
		input.croak("Unexpected token: " + JSON.stringify(input.peek()));
	}
	function maybeBinary(left, my_prec) {
		var tok = isOperator();
		if (tok) {
			var his_prec = PRECEDENCE[tok.value];
			if (his_prec > my_prec || typeof his_prec == "undefined") {
				input.next();

				const typeMap = {
					"=": "AssignmentExpression",
					":": "TypeExpression",
					"~": "ObjectAccessor",
				};
				return maybeBinary(
					{
						type: typeMap[tok.value] || "BinaryExpression",
						operator: tok.value,
						left: left,
						right: maybeBinary(parseAtom(), his_prec),
					},
					my_prec
				);
			}
		}
		return left;
	}
	function delimited(start, stop, separator, parser) {
		var a = [],
			first = true;
		skipPunctuation(start);
		while (!input.eof()) {
			if (isPunctuation(stop)) break;
			if (first) first = false;
			else skipPunctuation(separator);
			if (isPunctuation(stop)) break;
			a.push(parser());
		}
		skipPunctuation(stop);
		return a;
	}
	function parseCall(func) {
		return {
			type: "CallExpression",
			callee: func,
			args: delimited("(", ")", ",", parseExpression),
		};
	}
	function parseIdentifier() {
		var name = input.next();
		if (
			name.type != "Identifier" &&
			name.type != "punctuation" &&
			name.value == "("
		)
			input.croak("Expecting variable name or type declaration");
		return name.value;
	}
	function parseIf() {
		skipKeyword("if");
		var cond = parseExpression();
		if (!isPunctuation("{")) skipKeyword("then");
		var then = parseExpression();
		var ret: { type: string; cond: string; then: string; else?: string } = {
			type: "if",
			cond: cond,
			then: then,
		};
		if (isKeyword(Keyword.ELSE)) {
			input.next();
			ret.else = parseExpression();
		}
		return ret;
	}
	function parseLoop() {
		skipKeyword("for");
		// Get the name of the control variable
		var controlName = parseExpression();
		skipKeyword("in");
		var arrayName = parseExpression();
		if (!isPunctuation("{")) skipKeyword("do");
		var body = parseExpression();
		return {
			type: "ForInStatement",
			left: controlName,
			right: arrayName,
			body: body,
		};
	}

	function parseFunction() {
		return {
			type: "FunctionDeclaration",
			vars: delimited("(", ")", ",", parseExpression),
			body: parseExpression(),
		};
	}

	function parseBoolean() {
		let val = input.next().value;
		return {
			type: "Boolean",
			value: val == "true",
		};
	}
	function maybeCall(expr) {
		expr = expr();
		return isPunctuation("(") ? parseCall(expr) : expr;
	}
	function parseArray() {
		return {
			type: "ArrayExpression",
			elements: delimited("[", "]", ",", parseAtom),
		};
	}
	function parseImport() {
		skipKeyword("import");
		return {
			type: "ImportExpression",
			raw: isKeyword(Keyword.RAW)
				? (() => {
						skipKeyword("raw");
						return true;
				  })()
				: false,
			value: input.next().value,
			take: isKeyword(Keyword.TAKE)
				? (() => {
						skipKeyword("take");
						return delimited("(", ")", ",", parseIdentifier);
				  })()
				: undefined,
		};
	}

	function parsePublic() {
		skipKeyword("public");
		return {
			type: "ScopeExpression",
			scope: "public",
			name: input.next().value,
			value: (() => {
				if (isOperator("=")) {
					skipOperator("=");
				}
				return parseExpression();
			})(),
		};
	}

	function parseAtom() {
		return maybeCall(function () {
			if (isPunctuation("(")) {
				input.next();
				var exp = parseExpression();
				skipPunctuation(")");
				return exp;
			}
			if (isPunctuation("{")) return parseProgram();
			if (isKeyword(Keyword.IF)) return parseIf();
			if (isKeyword(Keyword.FOR)) return parseLoop();
			if (isPunctuation("[")) return parseArray();
			if (isKeyword(Keyword.TRUE) || isKeyword(Keyword.FALSE))
				return parseBoolean();
			if (isKeyword(Keyword.IMPORT)) return parseImport();
			if (isKeyword(Keyword.PUBLIC)) return parsePublic();
			if (isKeyword(Keyword.FUNC)) {
				input.next();
				return parseFunction();
			}
			var tok = input.next();
			if (
				tok.type == "Identifier" ||
				tok.type == "number" ||
				tok.type == "string"
			)
				return tok;
			unexpected();
		});
	}
	function parseToplevel() {
		var prog = [];
		while (!input.eof()) {
			prog.push(parseExpression());
			if (!input.eof()) skipPunctuation(";");
		}
		return { type: "Program", body: prog };
	}
	function parseProgram() {
		var prog = delimited("{", "}", ";", parseExpression);
		if (prog.length == 0) return {type: "Boolean", value: false};
		if (prog.length == 1) return prog[0];
		return { type: "Program", body: prog };
	}
	function parseExpression() {
		return maybeCall(function () {
			return maybeBinary(parseAtom(), 0);
		});
	}
}

export { parse };

import { InputStream } from "./InputStream.js";
import { Keyword } from "./types.js";

class TokenStream {
	private KEYWORDS: string[] = [
		"if",
		"else",
		"while",
		"func",
		"then",
		"for",
		"import",
		"from",
		"in",
		"do",
		"raw",
		"public",
		"true",
		"false",
		"Infinity",
		"return",
		"const",
		"let"
	];
	private current: string;
	constructor(private stream: InputStream) {}

	private isKeyword(x: string): boolean {
		return this.KEYWORDS.indexOf(x) >= 0;
	}
	private isDigit(ch: string): boolean {
		return /[0-9]/i.test(ch);
	}
	private isIdentifierStart(ch: string): boolean {
		return /[a-z_]/i.test(ch);
	}
	private isIdentifier(ch: string): boolean {
		return this.isIdentifierStart(ch) || "?!<>0123456789".indexOf(ch) >= 0;
	}
	private isOperatorChar(ch: string) {
		return (
			[
				"+",
				"-",
				"*",
				"/",
				"%",
				"=",
				"&",
				"|",
				"<",
				">",
				":",
				"!",
				".",
			].indexOf(ch) >= 0
		);
	}
	private isPunctuation(ch: string) {
		return ",;(){}[]".indexOf(ch) >= 0;
	}
	private isWhitespace(ch: string) {
		return " \t\n".indexOf(ch) >= 0;
	}
	private readWhile(predicate : Function) {
		var str = "";
		while (!this.stream.eof() && predicate(this.stream.peek()))
			str += this.stream.next();
		return str;
	}
	private readNumber() {
		var has_dot = false;
		var number = this.readWhile((ch: string) => {
			if (ch == ".") {
				if (has_dot) return false;
				has_dot = true;
				return true;
			}
			return this.isDigit(ch);
		});
		return { type: has_dot ? "float" : "integer", value: parseFloat(number) };
	}
	private readIdentifier() {
		var id = this.readWhile(this.isIdentifier.bind(this));
		return {
			type: this.isKeyword(id) ? "Keyword" : "Identifier",
			value: id,
		};
	}
	private readEscaped(end: string) {
		var escaped = false,
			str = "";
		this.stream.next();
		while (!this.stream.eof()) {
			var ch = this.stream.next();
			if (escaped) {
				str += ch;
				escaped = false;
			} else if (ch == "\\") {
				escaped = true;
			} else if (ch == end) {
				break;
			} else {
				str += ch;
			}
		}
		return str;
	}
	private readDoubleQuotedString() {
		return { type: "string", value: this.readEscaped('"') };
	}
	private readSingleQuotedString() {
		return { type: "string", value: this.readEscaped("'") };
	}
	private skipComment() {
		this.readWhile(function (ch: string) {
			return ch != "\n";
		});
		this.stream.next();
	}
	private readNext() {
		this.readWhile(this.isWhitespace);
		if (this.stream.eof()) return null;
		var ch = this.stream.peek();
		if (ch == "#") {
			this.skipComment();
			return this.readNext();
		}
		if (ch == '"') return this.readDoubleQuotedString();
		if (ch == "'") return this.readSingleQuotedString();
		if (this.isDigit(ch)) return this.readNumber();
		if (this.isIdentifierStart(ch)) return this.readIdentifier();
		if (this.isPunctuation(ch))
			return {
				type: "punctuation",
				value: this.stream.next(),
			};
		if (this.isOperatorChar(ch))
			return {
				type: "operator",
				value: this.readWhile(this.isOperatorChar),
			};
		this.stream.croak("Can't handle character: " + ch);
	}
	peek() {
		return this.current || (this.current = this.readNext());
	}
	next() {
		var tok = this.current;
		this.current = null;
		return tok || this.readNext();
	}
	eof() {
		return this.peek() == null;
	}

	croak(msg: string) {
		this.stream.croak(msg);
	}

	all() {
		var tokens: any[] = [];
		while (!this.eof()) tokens.push(this.next());
		return tokens;
	}
}

export { TokenStream };

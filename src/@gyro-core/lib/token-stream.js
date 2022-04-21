class TokenStream {
    constructor(stream) {
        this.stream = stream;
        this.KEYWORDS = [
            "if",
            "else",
            "while",
            "let",
            "const",
            "func",
            "then",
            "for",
            "import",
            "export",
            "from",
            "in",
            "do"
        ];
    }
    isKeyword(x) {
        return this.KEYWORDS.indexOf(x) >= 0;
    }
    isDigit(ch) {
        return /[0-9]/i.test(ch);
    }
    isIdentifierStart(ch) {
        return /[a-z_]/i.test(ch);
    }
    isIdentifier(ch) {
        return (this.isIdentifierStart(ch) || "?!<>0123456789".indexOf(ch) >= 0);
    }
    isOperatorChar(ch) {
        return (["+", "-", "*", "/", "%", "=", "&", "|", "<", ">", ":", "!", "~"].indexOf(ch) >= 0);
    }
    isPunctuation(ch) {
        return ",;(){}[]".indexOf(ch) >= 0;
    }
    isWhitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }
    readWhile(predicate) {
        var str = "";
        while (!this.stream.eof() && predicate(this.stream.peek()))
            str += this.stream.next();
        return str;
    }
    readNumber() {
        var has_dot = false;
        var number = this.readWhile((ch) => {
            if (ch == ".") {
                if (has_dot)
                    return false;
                has_dot = true;
                return true;
            }
            return this.isDigit(ch);
        });
        return { type: "number", value: parseFloat(number) };
    }
    readIdentifier() {
        var id = this.readWhile(this.isIdentifier.bind(this));
        return {
            type: this.isKeyword(id) ? "keyword" : "identifier",
            value: id,
        };
    }
    readEscaped(end) {
        var escaped = false, str = "";
        this.stream.next();
        while (!this.stream.eof()) {
            var ch = this.stream.next();
            if (escaped) {
                str += ch;
                escaped = false;
            }
            else if (ch == "\\") {
                escaped = true;
            }
            else if (ch == end) {
                break;
            }
            else {
                str += ch;
            }
        }
        return str;
    }
    readString() {
        return { type: "string", value: this.readEscaped('"') };
    }
    skipComment() {
        this.readWhile(function (ch) {
            return ch != "\n";
        });
        this.stream.next();
    }
    readNext() {
        this.readWhile(this.isWhitespace);
        if (this.stream.eof())
            return null;
        var ch = this.stream.peek();
        if (ch == "#") {
            this.skipComment();
            return this.readNext();
        }
        if (ch == '"')
            return this.readString();
        if (this.isDigit(ch))
            return this.readNumber();
        if (this.isIdentifierStart(ch))
            return this.readIdentifier();
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
    croak(msg) {
        this.stream.croak(msg);
    }
    all() {
        var tokens = [];
        while (!this.eof())
            tokens.push(this.next());
        return tokens;
    }
}
export { TokenStream };

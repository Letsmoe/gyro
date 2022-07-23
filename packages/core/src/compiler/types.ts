type Register = "eax" | "edx" | "rdi" | "rsi" | "rdx" | "rcx" | "r8" | "r9";

enum ResultType {
	RBP_OFFSET,
	REGISTER,
	LITERAL,
	LABEL,
}

const REGS = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];

export {ResultType, Register, REGS}
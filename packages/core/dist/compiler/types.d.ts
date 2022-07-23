declare type Register = "eax" | "edx" | "rdi" | "rsi" | "rdx" | "rcx" | "r8" | "r9";
declare enum ResultType {
    RBP_OFFSET = 0,
    REGISTER = 1,
    LITERAL = 2,
    LABEL = 3
}
declare const REGS: string[];
export { ResultType, Register, REGS };

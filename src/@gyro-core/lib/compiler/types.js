var ResultType;
(function (ResultType) {
    ResultType[ResultType["RBP_OFFSET"] = 0] = "RBP_OFFSET";
    ResultType[ResultType["REGISTER"] = 1] = "REGISTER";
    ResultType[ResultType["LITERAL"] = 2] = "LITERAL";
    ResultType[ResultType["LABEL"] = 3] = "LABEL";
})(ResultType || (ResultType = {}));
const REGS = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];
export { ResultType, REGS };

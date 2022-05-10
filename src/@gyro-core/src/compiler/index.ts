/**
 * BinaryExpression - +
 * 		-> number - 5
 * 		-> BinaryExpression - *
 * 			-> number - 6
 * 			-> number - 7
 * -> 47
 *
 * mov DWORD [rbp-4], 6
 * mov DWORD [rbp-8], 7
 * mov eax, DWORD [rbp-8]
 * imul edx, eax, DWORD [rbp-4]
 * mov DWORD [rbp-12], 5
 * add eax, edx, DWORD [rbp-12]
 *
 * => eax == 47 // True
 */
export { Compiler } from "./compiler.js";

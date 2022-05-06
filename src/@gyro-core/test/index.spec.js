import {Gyro} from "../lib/index.js";
import {Compiler} from "../lib/compiler/index.js";

export default (describe, it, expect) => {
	const content = `
	(x: int) = 4;
	(y: int) = 6 + x / 2;
	`

	// mov [rbp-4], 5
	// mov edx, DWORD [rbp-4]
	// mov eax, 6
	// add eax, edx
	// mov [rbp-8], eax

	console.log((new Compiler(Gyro.parse(content))).compile());
	process.exit()

	describe("Compilation Target", function () {

	})
}
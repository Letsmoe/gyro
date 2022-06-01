import * as fs from 'fs';
import * as path from 'path';
import {Gyro} from "../lib/index.js";
import {Compiler} from "../lib/compiler/index.js";

export default (describe, it, expect) => {
	describe("Compiling to ASM x86_64", function () {
		it("Should run default operators.", () => {
			const content = `
			(x: int) = 4;
			(y: int) = 6 + (x - 2) * 4;
			`
			let compiler = new Compiler(Gyro.parse(content));
			compiler.compile()
			let lines = compiler.getLines().slice(2)

			expect(lines[0]).toEqual("mov rbp, rsp");
			expect(lines[1]).toEqual("mov DWORD [rbp-4], 4");
			expect(lines[2]).toEqual("mov eax, DWORD [rbp-4]");
			expect(lines[3]).toEqual("mov edx, 2");
			expect(lines[4]).toEqual("sub eax, edx");
			expect(lines[5]).toEqual("mov edx, eax");
			expect(lines[6]).toEqual("mov eax, 4");
			expect(lines[7]).toEqual("imul eax, edx");
			expect(lines[8]).toEqual("mov edx, 6");
			expect(lines[9]).toEqual("add eax, edx");
			expect(lines[10]).toEqual("mov DWORD [rbp-8], eax");
		})

		it("Should compile a function.", () => {
			const content = `
			(add: int) = func((a: int), (b: int), (c: int), (d: int)) {
				(x: int) = a + b + c + d;
				return x;
			};
			(x: int) = add(1,2, 7,8);
			printnum(x);
			printnum(5);
			`
			let compiler = new Compiler(Gyro.parse(content));
			let result = compiler.compile()
			fs.writeFileSync(path.join(process.cwd(), "../bin/result.asm"), result);
			let lines = compiler.getLines();
			console.log(lines);
			process.exit(0)
		})
	})

	// Default Types
	// int - integer ([0-9]+)
	// float - floating point number ([0-9]+\.?[0-9]+)
	// string - string ("([^"]*)"|'([^']*)')
	// bool - boolean (true|false)
	// array - array ([\[\]])
}
import {Gyro} from "../lib/index.js";
import {Environment} from "../lib/environment.js";
import {Compiler} from "../lib/compiler/index.js";
import * as fs from "fs";

export default (describe, it, expect) => {
	let file = fs.readFileSync("./test_all.gyro", "utf8");
	//let env = new Environment(null)
	//env.def("print", (...args) => console.log(...args))
	//let [result, vars] = Gyro.evaluate(file, env);
	//console.log(Gyro.compile(file) + "\n");
	//console.log(result, vars);
	console.log((new Compiler(Gyro.parse(file))).compile());
	process.exit()

	describe("Gyro function declaration", () => {
		it("Should create a function which returns the sum of two numbers (5 and 10) => 15", () => {
			const sum = Gyro.evaluate("x = func(a,b) a+b; x(5,10);");
			expect(sum).toEqual(15);
			// Create a gyro function that multiplies two values together
			const multiply = Gyro.evaluate("x = func(a,b) a*b; x(5,10);");
			expect(multiply).toEqual(50);
		});
		it("Should accept type annotations on the function return type, the arguments and a variable.", () => {
			const main = Gyro.evaluate(`(x: int) = func((a: int), (b: int)) {
				(p: int) = a * b;
				p;
			};
			x(5,5);`)
			expect(main).toEqual(25);
		});
		it("Should define an array and access the 2nd property of it starting at 0", () => {
			const tildeHigherPrecedence = Gyro.evaluate(`(index: int) = 2; (x: Array<int>) = [5,12,18,6]; x~index + x~index + 1;`)
			expect(tildeHigherPrecedence).toEqual(37);
			const parenHigherPrecedence = Gyro.evaluate(`(index: int) = 2; (x: Array<int>) = [5,12,18,6]; x~index + x~(index + 1);`)
			expect(parenHigherPrecedence).toEqual(24);
		})
	})
}
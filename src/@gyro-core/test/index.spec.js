import {Gyro} from "../lib/index.js";

export default (describe, it, expect) => {
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
			const main = Gyro.evaluate(`(x: Array<int>) = [1,2,3,4]; x~2;`)
			expect(main).toEqual(3);
		})
	})
}
import { readConfig, addUser, userExists } from "../config.js";
import axios from "axios";
import prompts from "prompts";
import * as qs from "qs";
import { info } from "../error.js";
import { error } from "../error.js";
import { ArgumentParser } from "colarg/dist/types";

export const adduserCommand = [
	"adduser",
	"Add a user account to the local configuration.",
	(parser: ArgumentParser) => {
		let locals = parser.args._defaults;
		let username = locals[0];
		let password = locals[1];
		let email = locals[2];

		const [packageData, packagePath] = readConfig();

		(async () => {
			var data: { username: string; password: string; email: string };
			if (username && password && email) {
				data = { username, password, email };
			} else {
				// @ts-ignore
				data = await prompts.prompt([
					{
						type: "text",
						name: "username",
						message: "What is your username?",
					},
					{
						type: "password",
						name: "password",
						message: "What is the corresponding password?",
					},
					{
						type: "text",
						name: "email",
						message:
							"What is the email address connected to the account?",
					},
				]);
			}

			const inputData = {
				username: data.username,
				password: data.password,
				email: data.email,
			};

			// Check if the user already exists
			if (!userExists(inputData)) {
				axios({
					method: "post",
					url: "https://gyro.continuum-ai.de/api/validate_user.php",
					data: qs.stringify(inputData),
				}).then((response: any) => {
					let data = response.data;
					if (data.status === "success") {
						if (addUser(inputData)) {
							info("User account successfully added to config.");
						}
					} else {
						error("Failed to add user account.");
					}
				});
			}
		})();
	},
] as const;

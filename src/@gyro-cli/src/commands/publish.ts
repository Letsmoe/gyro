import { readUsers, User } from "../config.js";
import { readConfig } from "../config.js";
import axios from "axios";
import * as path from "path";
import * as fs from "fs";
import * as qs from "qs";
import * as mime from "mime-types";
import { ArgumentParser } from "colarg/dist/types";
import { error } from "../error.js";
import { info } from "console";

function isFileImage(file: string) {
	let type = mime.lookup(file);
	if (type) {
		return type.split('/')[0] === 'image';
	}
	return false;
}

export const publishCommand = [
	"deliver",
	"Send the parcel to the server.",
	(parser: ArgumentParser) => {
		const [packageData, packagePath] = readConfig();

		const users = readUsers();
		const user = users.find((u: User) => u.username == packageData.author);

		if (user) {
			let size = 0;
			const gist = {type: "folder", name: packageData.name, children: []};

			// Recursively loop through the project and add all folders and files to the gist array
			const addToGist = (dir: string, parent: {children: {}[], type: string, name: string}) => {
				const files = fs.readdirSync(dir);
				for (const file of files) {
					const filePath = path.join(dir, file);
					const stats = fs.statSync(filePath);
					if (stats.isDirectory()) {
						const child = {
							name: file,
							type: "folder",
							children: [],
						};
						parent.children.push(child)
						addToGist(filePath, child);
					} else {
						if (!isFileImage(filePath)) {
							let content = fs.readFileSync(filePath, "utf8") || "";
							parent.children.push({
								content: content,
								type: "file",
								name: file,
							});
							size += content.length;
						}
					}
				}
			};

			addToGist(path.dirname(packagePath), gist);

			const data = qs.stringify({
				name: packageData.name,
				version: packageData.version,
				owner: user.username,
				password: user.password,
				gist: gist,
				size: size
			});
	
			axios
				.post("https://gyro.continuum-ai.de/api/publish.php", data)
				.then((response: any) => {
					info(response.data)
				}).catch((error: any) => {
					error(error.response.data);
				});
		} else {
			error("The owner of this package is not present in the list of users on your system, add them with `gyst adduser`.");
		}
	},
] as const;

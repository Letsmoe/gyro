import * as fs from "fs";
import { warn, info, error } from "../error.js";
import { readConfig } from "../config.js";
import { ArgumentParser } from "colarg/dist/types";

const increment = /**
 * Increment the value of a version part by one if it is less than 999.
 * @date 4/24/2022 - 1:57:08 PM
 */
(num: string) => {
	let versionNumber = parseInt(num, 10);
	if (versionNumber < 999) {
		return (versionNumber + 1).toString();
	} else {
		return null
	}
}

export const versionCommand = [
	"version",
	"Update the version of the current project.",
	(parser: ArgumentParser) => {
		let locals = parser.args._defaults;
		let type = locals[0]
		const [packageData, packagePath] = readConfig();

		if (!type) {
			info(`Parcel '${packageData.name}' at version '${packageData.version}'.`);
			process.exit(1);
		}
		if (typeof packageData.version === "undefined") {
			warn(`Could not find version in gyst.json. Using '1.0.0'`);
			packageData.version = "1.0.0";
		} else {
			const version = packageData.version;
			const versionParts = version.split(".");

			const bumpPatch = () => {
				const patch = increment(versionParts[2]);
				if (patch !== null) {
					versionParts[2] = patch;
				} else {
					warn("We touched the limit of patches in this minor. Bumping minor!");
					bumpMinor();
				}
			}

			const bumpMinor = () => {
				const minor = increment(versionParts[1]);
				if (minor !== null) {
					versionParts[1] = minor;
					versionParts[2] = "0";
				} else {
					warn("We touched the limit of minors in this major. Bumping major!");
					bumpMajor();
				}
			}

			const bumpMajor = () => {
				const major = increment(versionParts[0]);
				if (major !== null) {
					versionParts[0] = major;
					versionParts[1] = "0";
					versionParts[2] = "0";
				} else {
					error("We touched the limit of majors!");
				}
			}


			if (type == "patch") {
				bumpPatch()
			} else if (type == "minor") {
				bumpMinor()
			} else if (type == "major") {
				bumpMajor()
			}
		
			info("Upgrading Parcel from " + packageData.version + " to " + versionParts.join("."));

			packageData.version = versionParts.join(".");
		}

		fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 4));
	},
] as const;

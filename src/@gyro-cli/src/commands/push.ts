import { readConfig } from "../config.js";
import * as fs from "fs";
import request from "request";
import { error, info } from "../error.js";
import DecompressZip from "decompress-zip";
import * as path from "path";
import { ArgumentParser } from "colarg/dist/types";

export const pushCommand = [
	"push",
	"Add a parcel to your dependencies array.",
	(parser: ArgumentParser) => {
		let locals = parser.args._defaults;
		let nameVersion = locals[0];

		const [packageData, packagePath] = readConfig();

		const [name, version] = nameVersion.split("@");

		if (!fs.existsSync("./modules/")) {
			fs.mkdirSync("./modules/");
		}
		if (!fs.existsSync(`./modules/${name}/`)) {
			fs.mkdirSync(`./modules/${name}/`);
		}
		packageData["dependencies"][name] = `^${version || ""}`;

		info("Pulling " + name + "...");

		request(
			`https://gyro.continuum-ai.de/api/pull.php?parcel=${name}&version=${version || ""}`
		)
			.pipe(fs.createWriteStream("./modules/" + name + ".zip"))
			.on("close", () => {
				info("Unpacking...");

				const unzipper = new DecompressZip(path.join(process.cwd(), "./modules/" + name + ".zip"))
				unzipper.extract({
					path: path.join(process.cwd(), "./modules/" + name + "/"),
				})
				unzipper.on("error", err => {
					error(err);
				})
				unzipper.on("extract", () => {
					info("Unpacking complete.");
					fs.writeFileSync(
						packagePath,
						JSON.stringify(packageData, null, 2)
					);
					info("Package successfully added to config.");
					info("Removing ZIP archive...");
					fs.unlinkSync("./modules/" + name + ".zip");
					info("Removing ZIP archive complete.");
					info("Package ready for import at " + name + "@" + version);
				})
			});
	},
] as const;

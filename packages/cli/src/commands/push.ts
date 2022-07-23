import { readConfig } from "../config.js";
import * as fs from "fs";
import request from "request";
import { error, info } from "../error.js";
import DecompressZip from "decompress-zip";
import * as path from "path";
import { ArgumentParser } from "colarg/dist/types";
import * as cliProgress from "cli-progress";
import { color, COLORS } from "colarg";

export const pushCommand = [
	"push",
	"Add a parcel to your dependencies array.",
	(parser: ArgumentParser) => {
		let receivedBytes = 0;
		let totalBytes = 0;
		let progressBar: cliProgress.SingleBar;

		let locals = parser.args._defaults;
		let nameVersion = locals[0];

		const [packageData, packagePath] = readConfig();

		const [name, version] = nameVersion.split("@");

		if (packageData.name === name) {
			error("Welp, i don't know why you would want to install this exact package right now... Sounds like a circular dependency.");
		}

		if (!fs.existsSync("./modules/")) {
			fs.mkdirSync("./modules/");
		}
		if (!fs.existsSync(`./modules/${name}/`)) {
			fs.mkdirSync(`./modules/${name}/`);
		}
		packageData["dependencies"][name] = `^${version || ""}`;

		request(
			`https://gyro.continuum-ai.de/api/pull.php?parcel=${name}&version=${
				version || ""
			}`
		)
			.on("data", (chunk: any) => {
				receivedBytes += chunk.length;
				progressBar.update(Math.round(receivedBytes / 1024 * 10) / 10);
			})
			.on("response", (data: any) => {
				totalBytes = parseInt(data.headers["content-length"]);
				progressBar = new cliProgress.SingleBar({
					format: `${color("[INFO]", COLORS.GREEN)}	Downloading '${name}@${version}.zip' | [{bar}] | {percentage}% | {value}/{total} kB`,
					barCompleteChar: "=",
					barIncompleteChar: "-",
					hideCursor: true,
					stopOnComplete: true,
				});
				progressBar.start(Math.round(totalBytes / 1024 * 10) / 10, 0, { speed: "N/A" });
			})
			.pipe(fs.createWriteStream("./modules/" + name + ".zip"))
			.on("close", () => {
				info("Unpacking parcel...");

				const unzipper = new DecompressZip(
					path.join(process.cwd(), "./modules/" + name + ".zip")
				);
				unzipper.extract({
					path: path.join(process.cwd(), "./modules/" + name + "/"),
				});
				unzipper.on("error", (err) => {
					error(err);
				});
				unzipper.on("extract", () => {
					info("Unpacking complete.");
					fs.writeFileSync(
						packagePath,
						JSON.stringify(packageData, null, 4)
					);
					info("Parcel successfully pushed onto stack.");
					info("Removing ZIP archive...");
					fs.unlinkSync("./modules/" + name + ".zip");
					info("Removing ZIP archive complete.");
					info("Parcel ready for import at " + name + "@" + version);
				});
			});
	},
] as const;

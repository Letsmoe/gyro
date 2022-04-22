import * as fs from "fs";
import { warn, info } from "../error.js";
import { readConfig } from "../config.js";
export const versionCommand = [
    "version",
    "Update the version of the current project.",
    (locals, type) => {
        const [packageData, packagePath] = readConfig();
        if (!type) {
            info(`Package '${packageData.name}' at version '${packageData.version}'.`);
            process.exit(1);
        }
        if (typeof packageData.version === "undefined") {
            warn(`Could not find version in package.gy.json. Using '0.0.1'`);
            packageData.version = "0.0.1";
        }
        else {
            const version = packageData.version;
            const versionParts = version.split(".");
            if (type == "patch") {
                versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
            }
            else if (type == "minor") {
                versionParts[1] = (parseInt(versionParts[1]) + 1).toString();
                versionParts[2] = "0";
            }
            else if (type == "major") {
                versionParts[0] = (parseInt(versionParts[0]) + 1).toString();
                versionParts[1] = "0";
                versionParts[2] = "0";
            }
            packageData.version = versionParts.join(".");
        }
        fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 4));
    },
];

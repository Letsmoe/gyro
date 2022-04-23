import { readConfig } from "../config.js";
import * as fs from "fs";
import { error, info, warn } from "../error.js";
export const popCommand = [
    "pop",
    "Remove a Parcel from your dependencies and delete its references.",
    (parser) => {
        let locals = parser.args._defaults;
        let name = locals[0];
        const [packageData, packagePath] = readConfig();
        if (name) {
            info("Returning Parcel '" + name + "' to sender...");
            let parcelPath = "./modules/" + name + "/";
            if (fs.existsSync(parcelPath)) {
                // Folder exists, remove it.
                fs.rmSync(parcelPath, { recursive: true });
                info("Successfully pushed Parcel off stack, we're done!");
            }
            else {
                warn("Parcel was missing from Stack. (How did your application ever work?)");
            }
            // Folder does not exist anymore, remove its reference from the config.
            info("Writing changes to config...");
            delete packageData["dependencies"][name];
            fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
            info("Successfully removed Parcel from config.");
        }
        else {
            error("You must specify a Parcel to pop.");
        }
    },
];

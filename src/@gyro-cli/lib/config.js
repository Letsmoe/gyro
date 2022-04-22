import * as path from "path";
import * as fs from "fs";
import { error } from "./error.js";
export function readConfig() {
    // Check if the config exists in the working directory
    const configPath = path.join(process.cwd(), "package.gy.json");
    if (!fs.existsSync(configPath)) {
        // Exit with error
        error(`Could not find package.gy.json in current directory.`);
    }
    // Read the configuration file
    try {
        const content = fs.readFileSync(configPath, "utf8");
        return [JSON.parse(content), configPath];
    }
    catch (e) {
        error("Could not parse package.gy.json.");
    }
}

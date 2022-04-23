import * as path from "path";
import * as fs from "fs";
import { error, warn } from "./error.js";
export function readConfig() {
    // Check if the config exists in the working directory
    const configPath = path.join(process.cwd(), "package.gyro.json");
    if (!fs.existsSync(configPath)) {
        // Exit with error
        error(`Could not find package.gyro.json in current directory.`);
    }
    // Read the configuration file
    try {
        const content = fs.readFileSync(configPath, "utf8");
        return [JSON.parse(content), configPath];
    }
    catch (e) {
        error("Could not parse package.gyro.json.");
    }
}
export function readUsers() {
    // Check if a user config exists, if not, create it.
    const userPath = "./gyro.users.json";
    if (!fs.existsSync(userPath)) {
        fs.writeFileSync(userPath, "[]");
        return [];
    }
    const content = fs.readFileSync(userPath, "utf8");
    return JSON.parse(content);
}
export function addUser(user) {
    const users = readUsers();
    // Check if the user already exists
    if (!userExists(user)) {
        // Write the user to the config
        users.push(user);
        fs.writeFileSync("./gyro.users.json", JSON.stringify(users, null, 4));
        return true;
    }
    else {
        return false;
    }
}
export function userExists(user) {
    const users = readUsers();
    for (const u of users) {
        if (u.username == user.username) {
            warn(`User '${user.username}' already exists.`);
            return true;
        }
    }
    return false;
}

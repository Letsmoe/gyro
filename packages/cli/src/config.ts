import * as path from "path";
import * as fs from "fs";
import { error, warn } from "./error.js";
import {shared} from "./shared.js";

const userFile = path.join(shared.__dirname, "gyro.users.json");

export interface User {
	username: string;
	password: string;
	email: string;
}

export function readConfig() {
	// Check if the config exists in the working directory
	const configPath = path.join(process.cwd(), "gyst.json");
	if (!fs.existsSync(configPath)) {
		// Exit with error
		error(`Could not find gyst.json in current directory.`);
	}

	// Read the configuration file
	try {
		const content = fs.readFileSync(configPath, "utf8");
		return [JSON.parse(content), configPath];
	} catch (e) {
		error("Could not parse gyst.json.");
	}
}

export function readUsers() {
	// Check if a user config exists, if not, create it.
	if (!fs.existsSync(userFile)) {
		fs.writeFileSync(userFile, "[]");
		return [];
	}
	const content = fs.readFileSync(userFile, "utf8");
	return JSON.parse(content);
}

export function addUser(user: User) {
	const users = readUsers();

	// Check if the user already exists
	if (!userExists(user)) {
		// Write the user to the config
		users.push(user);
		fs.writeFileSync(userFile, JSON.stringify(users, null, 4));
		return true;
	} else {
		return false;
	}
}

export function userExists(user: User) {
	const users = readUsers();
	for (const u of users) {
		if (u.username == user.username) {
			warn(`User '${user.username}' already exists.`);
			return true;
		}
	}
	return false;
}

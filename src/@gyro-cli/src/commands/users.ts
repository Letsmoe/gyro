import { color, COLORS } from "colarg";
import { info, warn } from "../error.js";
import { readUsers } from "../config.js";

export const userCommand = [
	"users",
	"List all added user accounts.",
	() => {
		const users = readUsers();

		if (users.length > 0) {
			info("Listing all users in gyro.users.json\n");

			for (const user of users) {
				info(color(user.username, "\x1b[1m") + " - " + color(user.email, COLORS.CYAN))
			}
		} else {
			warn("No users were found. Try adding one with `gyst adduser`");
		}
	},
] as const;

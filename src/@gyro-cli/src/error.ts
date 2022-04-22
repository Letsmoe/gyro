import {COLORS, color} from "colarg";

export function error(message: string) {
	process.stdout.write(color("ERROR", COLORS.RED) + "\t" + message + "\n");
	process.exit(1);
}

export function warn(message: string) {
	process.stdout.write(color("WARN", COLORS.YELLOW) + "\t" + message + "\n");
}

export function log(message: string) {
	process.stdout.write(message + "\n");
}

export function info(message: string) {
	process.stdout.write(color("INFO", COLORS.GREEN) + "\t" + message + "\n");
}
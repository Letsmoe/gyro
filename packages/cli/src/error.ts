import {COLORS, color} from "colarg";

export function error(message: string) {
	process.stdout.write(color("[ERROR]", "\u001b[41;1m") + "\t" + message + "\n");
	process.exit(1);
}

export function warn(message: string) {
	process.stdout.write(color("[WARN]", "\u001b[43;1m") + "\t" + message + "\n");
}

export function log(message: string) {
	process.stdout.write(message + "\n");
}

export function info(message: string) {
	process.stdout.write(color("[INFO]", COLORS.GREEN) + "\t" + message + "\n");
}
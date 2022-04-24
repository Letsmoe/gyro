import {shared} from "../shared.js";
import { ArgumentParser } from "colarg/dist/types";

export const locationCommand = [
	"location",
	"List information about the installation directory.",
	(parser: ArgumentParser) => {
		console.log("Working Directory: " + process.cwd());
		console.log("Main Directory: " + shared.__dirname);
	},
] as const;

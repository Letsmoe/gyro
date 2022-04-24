import { shared } from "../shared.js";
export const locationCommand = [
    "location",
    "List information about the installation directory.",
    (parser) => {
        console.log("Working Directory: " + process.cwd());
        console.log("Main Directory: " + shared.__dirname);
    },
];

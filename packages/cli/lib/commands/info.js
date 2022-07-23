import { info } from "../error.js";
import { readConfig } from "../config.js";
export const infoCommand = [
    "info",
    "List information about the current project.",
    (parser) => {
        const [data, path] = readConfig();
        let name = data.name;
        info(`Listing Information about '${name}'`);
        info(`Path: ${process.cwd()}`);
        info(`Name: ${name}`);
        info(`Version: ${data.version}`);
        info(`Description: ${data.description}`);
        info(`Author: ${data.author}`);
        info(`License: ${data.license}`);
        info(`Repository: ${data.repository}`);
        info(`Commands: ${Object.keys(data.commands).join(", ")}`);
        info(`Dependencies: ${Object.keys(data.dependencies).join(", ")}`);
        info(`Dev Dependencies: ${Object.keys(data.devDependencies).join(", ")}`);
        info(`Scripts: ${data.scripts.join(", ")}`);
    },
];

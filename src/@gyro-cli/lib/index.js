import { colarg } from "colarg";
import { initCommand } from "./commands/init.js";
import { versionCommand } from "./commands/version.js";
colarg(process.argv.slice(2))
    .command(...initCommand)
    .command(...versionCommand)
    .option("template", "t", "default", "The template to use.", false, "string")
    .help().args;

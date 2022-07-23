#!/usr/bin/env node
import { colarg } from "colarg";
import { initCommand } from "./commands/init.js";
import { publishCommand } from "./commands/publish.js";
import { versionCommand } from "./commands/version.js";
import { adduserCommand } from "./commands/adduser.js";
import { pushCommand } from "./commands/push.js";
import { popCommand } from "./commands/pop.js";
import { locationCommand } from "./commands/location.js";
import { infoCommand } from "./commands/info.js";
import { userCommand } from "./commands/users.js";
colarg(process.argv.slice(2))
    .command(...initCommand)
    .command(...versionCommand)
    .command(...publishCommand)
    .command(...adduserCommand)
    .command(...pushCommand)
    .command(...popCommand)
    .command(...locationCommand)
    .command(...infoCommand)
    .command(...userCommand)
    .help().args;

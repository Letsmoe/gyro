#!/usr/bin/env node

import { colarg } from "colarg";
import { initCommand } from "./commands/init.js";
import { publishCommand } from "./commands/publish.js";
import { versionCommand } from "./commands/version.js";
import { adduserCommand } from "./commands/adduser.js";
import { pushCommand } from "./commands/push.js";
import { popCommand } from "./commands/pop.js";

colarg(process.argv.slice(2))
	.command(...initCommand)
	.command(...versionCommand)
	.command(...publishCommand)
	.command(...adduserCommand)
	.command(...pushCommand)
	.command(...popCommand)
	.help().args;


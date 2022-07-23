var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as path from "path";
import * as fs from "fs";
import { StandardTemplates } from "../templates.js";
import prompts from "prompts";
import { replaceDefaults } from "../make-config.js";
import { info, warn, error } from "../error.js";
export const initCommand = [
    "init",
    "Create a new project with a specified name and template.",
    (parser) => __awaiter(void 0, void 0, void 0, function* () {
        let locals = parser.option({
            name: "template",
            alias: "t",
            defaults: "default",
            description: "The template to use.",
            required: false,
            type: "string",
        }).help().args;
        const data = yield prompts.prompt([
            {
                type: "text",
                name: "name",
                message: "What is the name of your project?",
                validate: (value) => {
                    if (value.length > 0 && /^[a-zA-Z0-9_-]*$/.test(value)) {
                        return true;
                    }
                    else {
                        return "Please enter a name for your parcel, it may only include letters, numbers or dash/underscore.";
                    }
                }
            },
            {
                type: "text",
                name: "version",
                message: "Version",
                validate: (value) => {
                    if (value.length > 0 && /^[0-9]{0,3}.[0-9]{0,3}.[0-9]{0,3}$/.test(value)) {
                        return true;
                    }
                    else {
                        return "Please enter a version for your parcel following this schema: ^[0-9]{0,3}.[0-9]{0,3}.[0-9]{0,3}$";
                    }
                },
                initial: "1.0.0"
            },
            {
                type: "text",
                name: "author",
                message: "Author",
            },
            {
                type: "text",
                name: "license",
                message: "License",
            },
            {
                type: "text",
                name: "description",
                message: "Description",
            },
            {
                type: "text",
                name: "repository",
                message: "Repository",
            },
            {
                type: "text",
                name: "homepage",
                message: "Homepage",
            },
            {
                type: "text",
                name: "tags",
                message: "Tags",
            },
            {
                type: "text",
                name: "testCommand",
                message: "Test command",
            }
        ], { onCancel: () => {
                error("Labeling parcel was interrupted!");
            } });
        const name = data.name;
        const tags = data.tags.split(",").map((x) => x.trim());
        const initializerProperties = {
            name: name,
            version: data.version,
            description: data.description,
            author: data.author,
            license: data.license,
            tags: tags,
            repository: data.repository,
            commands: {
                test: data.testCommand
            }
        };
        var template = locals.template;
        if (typeof template !== "undefined") {
            info(`🖃, your parcel has been stamped and is ready for shipping!`);
            // Check if the template exists in the standard templates object
            if (typeof StandardTemplates[template] === "undefined") {
                warn(`🥴, we're afraid we can't find that template, we decided to use the default one instead.`);
                template = "default";
            }
            else {
                info(`We found it! using '${template}' template.`);
            }
            const templateData = StandardTemplates[template];
            try {
                createProjectFromTemplate(name, templateData, initializerProperties);
                info(`🛎️  your parcel has arrived! Take a look at '${name}'!`);
            }
            catch (e) {
                warn(`😭, your parcel has been lost in shipping... We're so sorry for the inconvenience.`);
                error(e);
            }
        }
    }),
];
function createProjectFromTemplate(name, template, initializerProperties) {
    // Create a function that recursively loops through all the files and folders in the template structure and creates files from the given data
    fs.mkdirSync(path.join(process.cwd(), name), { recursive: true });
    // Recursively create files and folders from the template object
    const recurse = (folder, folderPath) => {
        for (let key in folder) {
            let value = folder[key];
            if (typeof value === "string") {
                fs.writeFileSync(path.join(folderPath, key), replaceDefaults(value, initializerProperties));
            }
            else if (typeof value === "object") {
                fs.mkdirSync(path.join(folderPath, key), { recursive: true });
                recurse(value, path.join(folderPath, key));
            }
        }
    };
    recurse(template.files, path.join(process.cwd(), name));
}

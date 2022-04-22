import * as path from "path";
import * as fs from "fs";
import { StandardTemplates } from "../templates.js";
import { warn } from "../error.js";
export const initCommand = [
    "init",
    "Create a new project with a specified name and template.",
    (locals, name) => {
        const initializerProperties = {
            PACKAGE_NAME: name,
            PACKAGE_DESCRIPTION: "",
        };
        const template = locals.template;
        console.log(`Creating new project '${name}'`);
        if (typeof template !== "undefined") {
            console.log(`Using '${template}' template.`);
            // Check if the template exists in the standard templates object
            if (typeof StandardTemplates[template] === "undefined") {
                console.error(`Template '${template}' does not exist.`);
                process.exit(1);
            }
            const templateData = StandardTemplates[template];
            try {
                createProjectFromTemplate(name, templateData, initializerProperties);
                console.log(`Created project '${name}' from template '${template}'.`);
            }
            catch (e) {
                console.error(`Failed to create project '${name}' from template '${template}'.`);
                console.error(e);
                process.exit(1);
            }
        }
    },
];
function createProjectFromTemplate(name, template, initializerProperties) {
    // Create a function that recursively loops through all the files and folders in the template structure and creates files from the given data
    fs.mkdirSync(path.join(process.cwd(), name), { recursive: true });
    // Recursively create files and folders from the template object
    const recurse = (folder, folderPath) => {
        for (const file of folder.children) {
            const newPath = path.join(folderPath, file.name);
            if (file.type === "folder") {
                fs.mkdirSync(newPath, { recursive: true });
                recurse(file, newPath);
            }
            else {
                let content = file.content;
                // Replace all the initializer properties in the file content
                content = content.replace(/\{\{([A-z0-9]+)\}\}/g, (all, name) => {
                    if (typeof initializerProperties[name] === "undefined") {
                        warn(`Could not find property '${name}' in initializer properties.`);
                        return "";
                    }
                    return initializerProperties[name];
                });
                fs.writeFileSync(newPath, content);
            }
        }
    };
    recurse(template.structure, path.join(process.cwd(), name));
}

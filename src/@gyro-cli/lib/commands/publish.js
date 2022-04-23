import { readUsers } from "../config.js";
import { readConfig } from "../config.js";
import axios from "axios";
import * as path from "path";
import * as fs from "fs";
import * as qs from "qs";
import * as mime from "mime-types";
function isFileImage(file) {
    let type = mime.lookup(file);
    if (type) {
        return type.split('/')[0] === 'image';
    }
    return false;
}
export const publishCommand = [
    "deliver",
    "Send the parcel to the server.",
    (parser) => {
        const [packageData, packagePath] = readConfig();
        const users = readUsers();
        const user = users.find((u) => u.username == packageData.owner);
        if (user) {
            let size = 0;
            const gist = { type: "folder", name: packageData.name, children: [] };
            // Recursively loop through the project and add all folders and files to the gist array
            const addToGist = (dir, parent) => {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    const filePath = path.join(dir, file);
                    const stats = fs.statSync(filePath);
                    if (stats.isDirectory()) {
                        const child = {
                            name: file,
                            type: "folder",
                            children: [],
                        };
                        parent.children.push(child);
                        addToGist(filePath, child);
                    }
                    else {
                        if (!isFileImage(filePath)) {
                            let content = fs.readFileSync(filePath, "utf8") || "";
                            parent.children.push({
                                content: content,
                                type: "file",
                                name: file,
                            });
                            size += content.length;
                        }
                    }
                }
            };
            addToGist(path.dirname(packagePath), gist);
            const data = qs.stringify({
                name: packageData.name,
                version: packageData.version,
                owner: user.username,
                password: user.password,
                gist: gist,
                size: size
            });
            axios
                .post("https://gyro.continuum-ai.de/api/publish.php", data)
                .then((response) => {
                console.log(response.data);
            });
        }
        else {
            console.error("User not found for package.");
        }
    },
];

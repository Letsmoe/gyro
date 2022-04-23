import { File } from "./structure/file.js";
import { Folder } from "./structure/folder.js";
export const StandardTemplates = {
    default: {
        name: "default",
        description: "A default template.",
        structure: Folder("", [
            Folder("src", [
                Folder("modules"),
                File("main.gy", "# Create a demo function that prints 'Hello, World!'\ndemo = func() {\n\tprint(\"Hello, World!\");\n}")
            ]),
            Folder("dist"),
            Folder("docs", [
                File("index.mpp", ""),
                File("mppconfig.mjs", ""),
            ]),
            Folder("test", [
                File("main.spec.gy", ""),
            ]),
            File("README.md", ""),
            File("LICENSE", ""),
            File("CHANGELOG.md", ""),
            File(".gitignore", ""),
            File("package.gyro.json", JSON.stringify({
                version: "0.0.1",
                name: "{{PACKAGE_NAME}}",
                description: "{{PACKAGE_DESCRIPTION}}",
            })),
        ])
    },
    minimal: {
        name: "minimal",
        description: "A minimal template.",
        structure: Folder("", [
            Folder("src", [
                Folder("modules"),
                File("main.gy", "# Create a demo function that prints 'Hello, World!'\ndemo = func() {\n\tprint(\"Hello, World!\");\n}")
            ]),
            Folder("dist"),
            Folder("docs", [
                File("index.mpp", ""),
                File("mppconfig.mjs", ""),
            ]),
            File("README.md", ""),
            File("LICENSE", ""),
            File("package.gyro.json", ""),
        ])
    },
};

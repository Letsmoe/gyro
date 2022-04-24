export const config = {
    name: "{{PARCEL_NAME}}",
    version: "{{PARCEL_VERSION}}",
    description: "{{PARCEL_DESCRIPTION}}",
    author: "{{PARCEL_AUTHOR}}",
    license: "{{PARCEL_LICENSE}}",
    repository: "{{PARCEL_REPOSITORY}}",
    commands: {
        test: "{{PARCEL_TEST_COMMAND}}",
        "build-watch": "gyst compile ./src/gyst.config.json -w",
        "build-docs-watch": "mppc ./docs/mppconfig.mjs -w",
        build: "gyst compile ./src/gyst.config.json",
        "build-docs": "mppc ./docs/mppconfig.mjs",
    },
    tags: "{{PARCEL_TAGS}}",
    dependencies: {},
    devDependencies: {},
    scripts: {}
};
export function replaceDefaults(str, info) {
    str = str.replace(/\{\{PARCEL_NAME\}\}/g, info.name)
        .replace(/\{\{PARCEL_VERSION\}\}/g, info.version)
        .replace(/\{\{PARCEL_DESCRIPTION\}\}/g, info.description)
        .replace(/\{\{PARCEL_AUTHOR\}\}/g, info.author)
        .replace(/\{\{PARCEL_LICENSE\}\}/g, info.license)
        .replace(/\{\{PARCEL_REPOSITORY\}\}/g, info.repository)
        .replace(/\{\{PARCEL_TEST_COMMAND\}\}/g, info.commands.test)
        .replace(/\{\{PARCEL_TAGS}}/g, JSON.stringify(info.tags));
    return str;
}

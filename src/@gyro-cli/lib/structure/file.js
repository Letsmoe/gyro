export function File(name, content) {
    return {
        type: "file",
        name: name,
        content: content
    };
}

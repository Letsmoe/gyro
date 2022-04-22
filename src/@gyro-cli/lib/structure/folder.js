export function Folder(name, children = []) {
    return { type: "folder", children: children, name: name };
}

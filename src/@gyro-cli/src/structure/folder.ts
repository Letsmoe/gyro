import { FileType } from "./file";

export interface FolderType {
	type: "folder";
	name: string;
	children: (FileType | FolderType)[];
}

export function Folder(
	name: string,
	children: (FileType | FolderType)[] = [],
) {
	return ({ type: "folder", children: children, name: name } as FolderType);
}

export interface FileType {
	type: "file";
	content: string;
	name: string;
}

export function File(name: string, content: string) {
	return ({
		type: "file",
		name: name,
		content: content
	} as FileType);
}
import { FileType } from "./file";
export interface FolderType {
    type: "folder";
    name: string;
    children: (FileType | FolderType)[];
}
export declare function Folder(name: string, children?: (FileType | FolderType)[]): FolderType;
//# sourceMappingURL=folder.d.ts.map
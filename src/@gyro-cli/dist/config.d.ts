export interface User {
    username: string;
    password: string;
    email: string;
}
export declare function readConfig(): any[];
export declare function readUsers(): any;
export declare function addUser(user: User): boolean;
export declare function userExists(user: User): boolean;
//# sourceMappingURL=config.d.ts.map
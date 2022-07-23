declare class Environment {
    vars: {
        [key: string]: any;
    };
    parent: Environment;
    publicKeys: string[];
    constructor(parent?: Environment);
    extend(): Environment;
    lookup(name: string): Environment;
    get(name: string): any;
    set(name: string, value: any): any;
    def(name: string, value: any, isPublic?: boolean): any;
}
export { Environment };

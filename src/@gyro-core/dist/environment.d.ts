declare class Environment {
    vars: {
        [key: string]: any;
    };
    parent: Environment;
    constructor(parent: Environment);
    extend(): Environment;
    lookup(name: any): Environment;
    get(name: string): any;
    set(name: string, value: any): any;
    def(name: string, value: any): any;
}
export { Environment };

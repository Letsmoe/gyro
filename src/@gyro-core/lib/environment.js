class Environment {
    constructor(parent) {
        this.vars = Object.create(parent ? parent.vars : null);
        this.parent = parent;
        this.publicKeys = Object.create(parent ? parent.publicKeys : []);
    }
    extend() {
        return new Environment(this);
    }
    lookup(name) {
        var scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name))
                return scope;
            scope = scope.parent;
        }
    }
    get(name) {
        if (name in this.vars)
            return this.vars[name];
        throw new Error("Undefined variable " + name);
    }
    set(name, value) {
        var scope = this.lookup(name);
        if (!scope && this.parent)
            throw new Error("Undefined variable " + name);
        return ((scope || this).vars[name] = value);
    }
    def(name, value, isPublic = false) {
        if (isPublic) {
            this.publicKeys.push(name);
        }
        return (this.vars[name] = value);
    }
}
export { Environment };

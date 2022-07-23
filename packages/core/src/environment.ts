class Environment {
	public vars: { [key: string]: any };
	public parent: Environment;
	public publicKeys: string[];
	constructor(parent?: Environment) {
		this.vars = Object.create(parent ? parent.vars : null);
		this.parent = parent;
		this.publicKeys = Object.create(parent ? parent.publicKeys : []);
	}
	extend() {
		return new Environment(this);
	}
	lookup(name: string) {
		var scope: Environment = this;
		while (scope) {
			if (Object.prototype.hasOwnProperty.call(scope.vars, name))
				return scope;
			scope = scope.parent;
		}
	}
	get(name: string) {
		if (name in this.vars) return this.vars[name];
		throw new Error("Undefined variable " + name);
	}
	set(name: string, value: any) {
		var scope = this.lookup(name);
		if (!scope && this.parent)
			throw new Error("Undefined variable " + name);
		return ((scope || this).vars[name] = value);
	}
	def(name: string, value: any, isPublic : boolean = false) {
		if (isPublic) {
			this.publicKeys.push(name);
		}
		return (this.vars[name] = value);
	}
}

export {Environment}
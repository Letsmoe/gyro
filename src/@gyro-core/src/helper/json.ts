function reverseObject(obj: {}) {
	var newObj = {};
	for (let key in obj) {
		let value = obj[key];
		if (typeof value === "object") {
			if (Array.isArray(value)) {
				value.map(x => {
					newObj[x] = key;
				})
			}
		} else {
			newObj[value] = key;
		}
	}
	return newObj;
}


export {reverseObject}
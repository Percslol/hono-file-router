import fs from 'fs';

export const httpMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];

/**
 * @param {string} cwd
 * @param {string} path
 * @param {string} [index]
 */
export function getListOfRoutes(cwd, path, index) {
	const folders = fs.readdirSync(`${cwd}/${path}`);

	/**@type {Object<string, string>[]} */
	const routes = [];
	/**@type {{message:string, data:*}[]} */
	const errors = [];

	folders.forEach((folder) => {
		/**@type {Object<string, string>} */
		const methodAssignment = {};

		[...httpMethods, ...(index ? [index] : [])].forEach((methodOrIndex) => {
			const pathToFile = `${cwd}/${path}/${folder}/${methodOrIndex}`;
			const jsExists = fs.existsSync(`${pathToFile}.js`);
			const tsExists = fs.existsSync(`${pathToFile}.ts`);

			if (jsExists && tsExists) errors.push({ message: 'Both js and ts files exist for that method. Only one must exist.', data: pathToFile });

			if (jsExists || tsExists) methodAssignment[index ? 'index' : methodOrIndex] = `${pathToFile}.${jsExists ? 'js' : 'ts'}`;
		});

		if (methodAssignment.index && Object.keys(methodAssignment).length !== 1)
			errors.push({ message: 'An index file exists along with method files. Please remove either to avoid confusion.', data: methodAssignment });

		routes.push(methodAssignment);
	});

	if (errors.length) throw Error(JSON.stringify(errors, null, '\t'));

	return routes;
}

export function getCwd() {
	return process.cwd();
}

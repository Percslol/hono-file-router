import fs from 'fs';

// From: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
export const httpMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];

export function getListOfRoutes(cwd: string, path: string, index?: string) {
	const folders = fs.readdirSync(`${cwd}/${path}`);

	const routes: { [key: string]: string }[] = [];
	const errors: { message: string; data: any }[] = [];

	folders.forEach((folder) => {
		const methodAssignment: { [key: string]: string } = {};

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

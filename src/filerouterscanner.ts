import fs from 'node:fs';
import path from 'node:path';

// From: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
export const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD', 'CONNECT', 'TRACE', 'index'] as const;

type httpMethodTypes = { [K in (typeof httpMethods)[number]]?: RouteInfo };
export type RouteInfo = { file: string; route: string; method: (typeof httpMethods)[number] };

export function fileRouterScanner(initpath: string) {
	const normalFolders = directoryScanner(initpath);

	const resolvedPath = path.resolve(initpath);
	
	const routes: httpMethodTypes[] = [];
	const errors: { message: string; data: any }[] = [];

	normalFolders.forEach((folder) => {
		if (!folder.directory) return;

		const methodAssignment: httpMethodTypes & Record<string, RouteInfo> = {};

		httpMethods.forEach((methodOrIndex) => {
			const pathToFile = `${folder.path}/${folder.name}/${methodOrIndex}`;
			const jsExists = fileExists(`${pathToFile}.js`);
			const tsExists = fileExists(`${pathToFile}.ts`);

			if (jsExists && tsExists) errors.push({ message: 'Both js and ts files exist for that method. Only one must exist.', data: pathToFile });

			if (jsExists || tsExists) {
				const route = `${folder.path.replaceAll(resolvedPath, '').replaceAll(/\\/g, '/')}/${folder.name === '.' ? '' : folder.name}`;
				methodAssignment[methodOrIndex] = {
					file: `${pathToFile}.${jsExists ? 'js' : 'ts'}`,
					route: replaceParams(route),
					method: methodOrIndex,
				};
			}
		});

		if (methodAssignment.index && Object.keys(methodAssignment).length !== 1)
			errors.push({ message: 'An index file exists along with method files. Please remove either to avoid confusion.', data: methodAssignment });

		routes.push(methodAssignment);
	});
	
	function replaceParams(path: string) {
		return path.replace(/\[([^\]]+)\]/g, ':$1');
	}

	if (errors.length) throw Error(JSON.stringify(errors, null, '\t'));

	return routes;
}

export function fileExists(file: string) {
	return fs.existsSync(file);
}

export function directoryScanner(path: string) {
	const folders = fs.readdirSync(path, { recursive: true, withFileTypes: true });
	return folders.map((folders) => ({ name: folders.name, path: folders.parentPath, directory: folders.isDirectory() }));
}
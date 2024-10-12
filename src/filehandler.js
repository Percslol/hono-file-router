import fs from 'fs';

/**@param {string} path */
export function getListOfFiles(path) {
	const files = fs.readdirSync(path);

	return files;
}

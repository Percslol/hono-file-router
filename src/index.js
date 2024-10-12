import { getCwd, getListOfRoutes } from './helpers';

/**
 * @param {object} p
 * @param {string} [p.path]
 */
export async function createFolderRoute({ path } = {}) {
	if (!path) throw Error('path is required');

	const cwd = getCwd();

	const routes = getListOfRoutes(cwd, path);

	console.log(routes);
}

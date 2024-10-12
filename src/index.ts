import { getCwd, getListOfRoutes } from './helpers';

export async function createFolderRoute({ path }: { path?: string } = {}) {
	if (!path) throw Error('path is required');

	const cwd = getCwd();
	const routes = getListOfRoutes(cwd, path);

	console.log(routes);
}

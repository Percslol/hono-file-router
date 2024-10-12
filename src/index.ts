import { getCwd, fileRouterScanner } from './filerouterscanner';

export async function createFolderRoute({ path }: { path?: string } = {}) {
	if (!path) throw Error('path is required');

	const cwd = getCwd();
	const routes = fileRouterScanner(cwd, path, 'index');

	await Promise.all(
		routes.map(async (route) => {
			// if (route.)
		}),
	);

	console.log(routes);
}

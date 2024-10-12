import { getCwd, fileRouterScanner, httpMethods } from './filerouterscanner';
import { type RouteInfo } from './filerouterscanner';

import { Hono } from 'hono';

import { createHandler } from './routegenerator';

async function createFolderRoute({ path }: { path?: string } = {}) {
	if (!path) throw Error('path is required');

	const cwd = getCwd();
	const routes = fileRouterScanner(cwd, path);
	const flattenedRoutes: RouteInfo[] = [];

	routes.forEach((route) =>
		httpMethods.forEach((method) => {
			const routeMethod = route[method];
			if (routeMethod) flattenedRoutes.push(routeMethod);
		}),
	);

	const promises: Promise<any>[] = [];
	const app = new Hono();

	flattenedRoutes.forEach((route) => {
		if (route.method === 'index') {
			promises.push(
				import(`file://${route.file}`).then((importedRoutes) => {
					httpMethods.forEach((method) => {
						if (method !== 'index') {
							if (importedRoutes[method]) app.on(method, route.route, ...importedRoutes[method]);
						}
					});
				}),
			);
		} else {
			promises.push(
				import(`file://${route.file}`).then(async (importedRoute) => {
					app.on(route.method, route.route, ...importedRoute.default);
				}),
			);
		}
	});

	await Promise.all(promises);

	return app;
}

export { createHandler, createFolderRoute };

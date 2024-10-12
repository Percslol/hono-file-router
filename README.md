# Hono File Router 🔥

File-based router for easier route management for hono. Heavily inspired by SvelteKit's file-based routing. Future features of this router will be based on how SvelteKit handles files.

## Install

Installation is simple. You may install it using any of the popular package managers out there that can use npmjs.

```
npm install hono-file-router
```

## How It Works

Supposed you have a file structure that looks like this:

```
./
├- src/
│  ├- api/
│  │  ├- tasks/
│  │  │  ├- [id]/
│  │  │  │  └- GET.ts
│  │  │  ├- change
│  │  │  │  └- index.ts
│  │  │  ├- GET.ts
│  │  │  └- POST.ts
│  │  └- GET.ts
│  └- app.ts
└ package.json
```

Inside the `app.ts` you may import the folder router in your `hono` app initialization as shown:

```ts
// app.ts
import { Hono } from 'hono';
import { createFolderRoute } from 'hono-file-router';

const app = new Hono();

app.get('/hello', (c) => {
	return c.text('Hello Hono!');
});

// path is relative to root directory
app.route('/api', await createFolderRoute({ path: './src/api' }));

//... rest of your routes
```

During server start, `createFolderRoute` scans the provided `path` folder and imports all of the methods found inside. In the example provided above,
all `POST.ts` and `GET.ts` scripts are mounted to the hono application. All [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) are supported.

Inside the `method` ts files, you can create the route by importing hono's factory [`createHandlers`](https://hono.dev/docs/helpers/factory#factory-createhandlers). However, I
suggest you use the passthrough `createHandler` function exported by the file router as in the future we will improve it and implement type-safe routes.

```ts
// ./src/api/GET.ts
import { createHandler } from 'hono-file-router';

export default createHandler(async (context) => {
	return context.json({ hello: 'world!' });
});
```

You might have noticed that we have a file `./src/api/tasks/change/index.ts`. If you want to keep your methods in a single file, you can do so by exporting your methods as variables.

```ts
import { createHandler } from 'hono-file-router';

export const GET = createHandler(async (context) => {
	return context.json({ hello: 'world!' });
});

export const POST = createHandler(async (context) => {
	return context.json({ hi: 'you are using POST method' });
});
```

Keep in mind that methods are case sensitive and must always be in uppercase.

## To Do

Features that needs to be implemented. Feel free to contribute.

### Must Have Features

- [ ] Build (`import()` is not build-friendly, an intermediate compile step is needed)
- [ ] Rest parameters (`/path/[...to]/file` will allow `/path/this/is/a/long/file` route)
- [ ] 404 error file (`error.ts` maybe?)
- [ ] Optional parameters (sveltekit uses `[[optional]]` parameters)
- [ ] Route sorting (which ones go first if multiple matches are found)
- [ ] [Route Matcher](https://kit.svelte.dev/docs/advanced-routing#matching)
- [ ] Encoding (unusable chars in the filesystem can be used as chars in routes)
- [ ] RegEx Matcher (we can leverage the use of encoding when that feature is done)

### Nice to Have Features

- [ ] None for now

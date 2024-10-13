import { describe, it, expect } from 'vitest';

import { createHandler } from './routegenerator';

describe('route generator', () => {
	it('test route generator', () => {
		const PROMISE = createHandler((context) => {
			return context.json({ hello: 'world' });
		});
		expect(Array.isArray(PROMISE)).toBe(true);
	});
});

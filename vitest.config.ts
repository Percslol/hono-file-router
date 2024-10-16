import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			provider: 'istanbul',
			include: ['./dist/**/*.cjs', './dist/**/*.mjs'],
			enabled: true,
		},
	},
});

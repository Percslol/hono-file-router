import { describe, it, expectTypeOf, expect } from 'vitest';

import { getCwd, cleanupPath, directoryScanner, fileExists } from './filerouterscanner';

describe('file router scanner', () => {
	it('test cwd', () => {
		const directory = getCwd();

		expectTypeOf(directory).toMatchTypeOf('pathstring');
	});

	it('test cleanup path', () => {
		expect(cleanupPath('/./')).toBe('/');
		expect(cleanupPath('\\')).toBe('/');
	});

	it('scans directories', () => {
		const listOfFiles = directoryScanner('./src');
		const filtered = listOfFiles.filter((file) => file.name === 'filerouterscanner.ts');
		expect(filtered[0].name).toBe('filerouterscanner.ts');
	});

	it('checks for existing file', () => {
		expect(fileExists('./src/filerouterscanner.ts')).toBe(true);
		expect(fileExists('./src/thisfiledoesnotexistandwillneverbe')).toBe(false);
	});

	it.todo('test filerouterscanner');
});

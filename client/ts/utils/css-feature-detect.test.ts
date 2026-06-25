import { beforeEach, describe, expect, it, vi } from 'vitest';

import { detectCssFeature } from './css-feature-detect';

describe('detectCssFeature', () => {
	beforeEach(() => {
		document.documentElement.className = '';
	});

	it('returns true and adds no class when feature is supported', () => {
		vi.stubGlobal('CSS', {
			supports: vi.fn(() => true),
		});

		const result = detectCssFeature('animation-timeline', 'scroll()');

		expect(result).toBe(true);
		expect(document.documentElement.className).toBe('');
	});

	it('adds the auto-generated class when unsupported', () => {
		vi.stubGlobal('CSS', {
			supports: vi.fn(() => false),
		});

		const result = detectCssFeature('animation-timeline', 'scroll()');

		expect(result).toBe(false);
		expect(document.documentElement.classList.contains('no-animation-timeline')).toBe(true);
	});

	it('uses custom class name when provided', () => {
		vi.stubGlobal('CSS', {
			supports: vi.fn(() => false),
		});

		detectCssFeature('animation-timeline', 'scroll()', 'no-view-timeline');

		expect(document.documentElement.classList.contains('no-view-timeline')).toBe(true);
		expect(document.documentElement.classList.contains('no-animation-timeline')).toBe(false);
	});

	it('returns false when CSS.supports is unavailable', () => {
		vi.stubGlobal('CSS', undefined);

		const result = detectCssFeature('animation-timeline', 'scroll()', 'no-view-timeline');

		expect(result).toBe(false);
		expect(document.documentElement.classList.contains('no-view-timeline')).toBe(true);
	});

	it('returns false when CSS is undefined entirely', () => {
		vi.stubGlobal('CSS', undefined);

		const result = detectCssFeature('grid', '1fr');

		expect(result).toBe(false);
		expect(document.documentElement.classList.contains('no-grid')).toBe(true);
	});
});

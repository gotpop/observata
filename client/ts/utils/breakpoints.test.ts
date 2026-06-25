import { describe, expect, it, vi } from 'vitest';
import {
	BREAKPOINTS,
	MQ,
	MQ_MAX,
	MQ_ONLY,
	createMatchMedia,
	createMatchMediaMax,
	createMatchMediaOnly,
} from './breakpoints';

describe('BREAKPOINTS', () => {
	it('has the expected breakpoint pixel values', () => {
		expect(BREAKPOINTS.sm).toBe(640);
		expect(BREAKPOINTS.md).toBe(768);
		expect(BREAKPOINTS.lg).toBe(1024);
		expect(BREAKPOINTS.xl).toBe(1280);
		expect(BREAKPOINTS['2xl']).toBe(1536);
	});
});

describe('MQ (min-width queries)', () => {
	it('generates correct min-width media query strings', () => {
		expect(MQ.sm).toBe('(width >= 640px)');
		expect(MQ.md).toBe('(width >= 768px)');
		expect(MQ.lg).toBe('(width >= 1024px)');
		expect(MQ.xl).toBe('(width >= 1280px)');
		expect(MQ['2xl']).toBe('(width >= 1536px)');
	});
});

describe('MQ_ONLY (exact-range queries)', () => {
	it('generates bounded range queries for all but the largest', () => {
		expect(MQ_ONLY.sm).toBe('(width >= 640px) and (width < 768px)');
		expect(MQ_ONLY.md).toBe('(width >= 768px) and (width < 1024px)');
		expect(MQ_ONLY.lg).toBe('(width >= 1024px) and (width < 1280px)');
		expect(MQ_ONLY.xl).toBe('(width >= 1280px) and (width < 1536px)');
	});

	it('has no upper bound for the largest breakpoint', () => {
		expect(MQ_ONLY['2xl']).toBe('(width >= 1536px)');
	});
});

describe('MQ_MAX (max-width queries)', () => {
	it('generates correct max-width media query strings', () => {
		expect(MQ_MAX.sm).toBe('(width < 640px)');
		expect(MQ_MAX.md).toBe('(width < 768px)');
		expect(MQ_MAX.lg).toBe('(width < 1024px)');
		expect(MQ_MAX.xl).toBe('(width < 1280px)');
		expect(MQ_MAX['2xl']).toBe('(width < 1536px)');
	});
});

describe('createMatchMedia helpers', () => {
	it('calls window.matchMedia with the correct query', () => {
		const mockMql = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
		const matchMediaSpy = vi.fn(() => mockMql);
		vi.stubGlobal('matchMedia', matchMediaSpy);

		createMatchMedia('md');
		expect(matchMediaSpy).toHaveBeenCalledWith('(width >= 768px)');

		createMatchMediaOnly('lg');
		expect(matchMediaSpy).toHaveBeenCalledWith('(width >= 1024px) and (width < 1280px)');

		createMatchMediaMax('sm');
		expect(matchMediaSpy).toHaveBeenCalledWith('(width < 640px)');

		vi.unstubAllGlobals();
	});
});

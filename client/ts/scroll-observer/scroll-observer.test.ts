import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { initScrollObserver } from './scroll-observer';

describe('initScrollObserver', () => {
	let rafCallbacks: ((time: number) => void)[];
	let scrollListeners: ((event: Event) => void)[];

	beforeEach(() => {
		rafCallbacks = [];
		scrollListeners = [];

		vi.stubGlobal('requestAnimationFrame', (cb: (time: number) => void) => {
			rafCallbacks.push(cb);
			return 0;
		});

		const originalAddEventListener = window.addEventListener;
		vi.spyOn(window, 'addEventListener').mockImplementation(
			(type: string, listener: (event: Event) => void) => {
				if (type === 'scroll') {
					scrollListeners.push(listener);
				}
				return originalAddEventListener.call(window, type, listener as never);
			}
		);
	});

	afterEach(() => {
		document.documentElement.className = '';
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('does nothing when no-view-timeline class is absent', () => {
		initScrollObserver();

		expect(scrollListeners.length).toBe(0);
	});

	it('adds scroll listener when no-view-timeline class is present', () => {
		document.documentElement.classList.add('no-view-timeline');

		initScrollObserver();

		expect(scrollListeners.length).toBe(1);
	});

	it('does not add has-scrolled when at top of page', () => {
		document.documentElement.classList.add('no-view-timeline');
		Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });

		initScrollObserver();
		// Flush initial rAF
		rafCallbacks.forEach((cb) => cb(0));

		expect(document.documentElement.classList.contains('has-scrolled')).toBe(false);
	});

	it('adds has-scrolled when scrolled past 100px', () => {
		document.documentElement.classList.add('no-view-timeline');
		Object.defineProperty(window, 'scrollY', { value: 150, configurable: true });

		initScrollObserver();
		// Flush initial rAF
		rafCallbacks.forEach((cb) => cb(0));

		expect(document.documentElement.classList.contains('has-scrolled')).toBe(true);
		expect(document.documentElement.classList.contains('scrolled-once')).toBe(true);
	});

	it('removes has-scrolled when scrolling back to top (but keeps scrolled-once)', () => {
		document.documentElement.classList.add('no-view-timeline');
		Object.defineProperty(window, 'scrollY', { value: 150, configurable: true });

		initScrollObserver();
		rafCallbacks.forEach((cb) => cb(0));
		expect(document.documentElement.classList.contains('has-scrolled')).toBe(true);

		// Scroll back to top
		Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
		rafCallbacks.length = 0;
		scrollListeners.forEach((l) => l(new Event('scroll')));
		rafCallbacks.forEach((cb) => cb(0));

		expect(document.documentElement.classList.contains('has-scrolled')).toBe(false);
		expect(document.documentElement.classList.contains('scrolled-once')).toBe(true);
	});

	it('uses rAF throttling — does not queue multiple rAFs', () => {
		document.documentElement.classList.add('no-view-timeline');
		Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });

		initScrollObserver();

		rafCallbacks.length = 0;
		// Fire 3 scroll events without flushing rAF
		scrollListeners.forEach((l) => l(new Event('scroll')));
		scrollListeners.forEach((l) => l(new Event('scroll')));
		scrollListeners.forEach((l) => l(new Event('scroll')));

		expect(rafCallbacks.length).toBe(1);
	});
});

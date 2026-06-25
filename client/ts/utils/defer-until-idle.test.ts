import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { deferUntilIdle } from './defer-until-idle';

describe('deferUntilIdle', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('uses requestIdleCallback when available', () => {
		const cb = vi.fn();
		const rIC = vi.fn((callback: () => void) => callback());
		vi.stubGlobal('requestIdleCallback', rIC);

		deferUntilIdle(cb);

		expect(rIC).toHaveBeenCalledWith(cb, { timeout: 3000 });
		rIC.mockRestore();
	});

	it('falls back to setTimeout when requestIdleCallback is missing', () => {
		const cb = vi.fn();
		// Ensure requestIdleCallback is fully absent (vi.stubGlobal leaves key present)
		Reflect.deleteProperty(window, 'requestIdleCallback');

		deferUntilIdle(cb, 5000);

		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(4999);
		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('uses default timeout of 3000ms', () => {
		const cb = vi.fn();
		Reflect.deleteProperty(window, 'requestIdleCallback');

		deferUntilIdle(cb);

		vi.advanceTimersByTime(2999);
		expect(cb).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(cb).toHaveBeenCalledTimes(1);
	});
});

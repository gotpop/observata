import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PerformanceMonitor } from './performance-monitor';

describe('PerformanceMonitor', () => {
	let observerCallback: (list: {
		getEntries: () => { duration: number; entryType: string }[];
	}) => void;
	let mockObserver: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		// Silence console output during tests
		vi.spyOn(console, 'info').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});

		mockObserver = {
			observe: vi.fn(),
			disconnect: vi.fn(),
		};

		// Stub PerformanceObserver as a proper constructor with spy
		observerCallback = () => {};
		const ctorSpy = vi.fn();
		class MockPerformanceObserver {
			static supportedEntryTypes = ['long-animation-frame', 'longtask'];
			observe = mockObserver.observe;
			disconnect = mockObserver.disconnect;
			constructor(cb: typeof observerCallback) {
				ctorSpy();
				observerCallback = cb;
			}
		}
		vi.stubGlobal('PerformanceObserver', MockPerformanceObserver);
		vi.stubGlobal('__perfObserverCtorCalls', ctorSpy);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('uses PerformanceObserver when longtask entry type is supported', () => {
		const monitor = new PerformanceMonitor({ onOverload: vi.fn() });
		monitor.start();

		expect(mockObserver.observe).toHaveBeenCalledWith({
			entryTypes: ['long-animation-frame', 'longtask'],
		});
	});

	it('does not call onOverload when events are below threshold', () => {
		const onOverload = vi.fn();
		const monitor = new PerformanceMonitor({ onOverload, slowThreshold: 50 });
		monitor.start();

		// Simulate a fast event
		observerCallback({
			getEntries: () => [{ duration: 30, entryType: 'longtask' }],
		});

		expect(onOverload).not.toHaveBeenCalled();
		expect(monitor.getStats().slowEventCount).toBe(0);
	});

	it('counts slow events and triggers overload after reaching limit', () => {
		const onOverload = vi.fn();
		const monitor = new PerformanceMonitor({ onOverload, slowThreshold: 50, slowLimit: 3 });
		monitor.start();

		// Two slow events — not enough yet
		observerCallback({ getEntries: () => [{ duration: 60, entryType: 'longtask' }] });
		observerCallback({ getEntries: () => [{ duration: 70, entryType: 'longtask' }] });

		expect(onOverload).not.toHaveBeenCalled();
		expect(monitor.getStats().slowEventCount).toBe(2);

		// Third slow event — triggers overload
		observerCallback({ getEntries: () => [{ duration: 80, entryType: 'longtask' }] });

		expect(onOverload).toHaveBeenCalledTimes(1);
		expect(onOverload).toHaveBeenCalledWith({
			slowEventCount: 3,
			lastDuration: 80,
		});
	});

	it('disconnects observer on stop', () => {
		const monitor = new PerformanceMonitor({ onOverload: vi.fn() });
		monitor.start();

		monitor.stop();

		expect(mockObserver.disconnect).toHaveBeenCalled();
	});

	it('start is idempotent — calling twice does not create two observers', () => {
		const ctorSpy = globalThis.__perfObserverCtorCalls as ReturnType<typeof vi.fn>;
		const monitor = new PerformanceMonitor({ onOverload: vi.fn() });
		monitor.start();
		monitor.start();

		expect(ctorSpy).toHaveBeenCalledTimes(1);
	});

	it('getStats returns current slow event count', () => {
		const monitor = new PerformanceMonitor({
			onOverload: vi.fn(),
			slowThreshold: 50,
			slowLimit: 10,
		});
		monitor.start();

		observerCallback({ getEntries: () => [{ duration: 60, entryType: 'longtask' }] });

		expect(monitor.getStats()).toEqual({ slowEventCount: 1 });
	});

	it('uses custom defaults when options are omitted', () => {
		const monitor = new PerformanceMonitor({ onOverload: vi.fn() });
		monitor.start();

		// Default slowThreshold is 50ms, default slowLimit is 3
		// Event at exactly 50ms should count
		observerCallback({ getEntries: () => [{ duration: 50, entryType: 'longtask' }] });

		expect(monitor.getStats().slowEventCount).toBe(1);
	});
});

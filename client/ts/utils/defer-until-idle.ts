/**
 * Defer a callback until the browser is idle.
 *
 * Uses `requestIdleCallback` where available (Chrome, Firefox, Edge).
 * Falls back to `setTimeout` on Safari, which doesn't yet support it.
 *
 * @param callback - Work to run when idle
 * @param timeout  - Max milliseconds to wait before forcing the callback (default: 3000)
 */
export function deferUntilIdle(callback: () => void, timeout = 3000): void {
	if ('requestIdleCallback' in window) {
		window.requestIdleCallback(callback, { timeout });
	} else {
		setTimeout(callback, timeout);
	}
}

/**
 * GPU/CPU overload detection.
 *
 * Primary: PerformanceObserver with `longtask` / `long-animation-frame` entry types.
 * Fallback: requestAnimationFrame frame timing (for Safari which supports neither).
 *
 * Counts slow events cumulatively since start. When the limit is reached,
 * fires onOverload and stops itself. No reset — if enough slow events
 * happen at any point, the shader is killed.
 */

type PerformanceMonitorOptions = {
	/** Minimum event duration (ms) to count as "slow". Default: 50 */
	slowThreshold?: number;
	/** Number of slow events before triggering overload. Default: 3 */
	slowLimit?: number;
	/** Callback fired when GPU/CPU overload is detected */
	onOverload: (stats: { slowEventCount: number; lastDuration: number }) => void;
};

export class PerformanceMonitor {
	private slowEventCount = 0;
	private observer: PerformanceObserver | null = null;
	private rafId: number | null = null;
	private lastFrameTime = 0;
	private readonly slowThreshold: number;
	private readonly slowLimit: number;
	private readonly onOverload: PerformanceMonitorOptions['onOverload'];

	constructor(options: PerformanceMonitorOptions) {
		this.slowThreshold = options.slowThreshold ?? 50;
		this.slowLimit = options.slowLimit ?? 3;
		this.onOverload = options.onOverload;
	}

	start(): void {
		if (this.observer || this.rafId !== null) return;

		const entryTypes: string[] = [];

		// long-animation-frame is preferred (includes rendering work)
		// but only available in Chrome 123+
		if (PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')) {
			entryTypes.push('long-animation-frame');
		}

		// longtask is the fallback (main thread only, wider support)
		if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
			entryTypes.push('longtask');
		}

		if (entryTypes.length > 0) {
			this.observer = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					if (entry.duration >= this.slowThreshold) {
						this.recordSlow(entry.duration, entry.entryType);
					}
				}
			});

			this.observer.observe({ entryTypes });
			console.info(
				`Performance monitor: Using PerformanceObserver [${entryTypes.join(', ')}] ` +
					`(threshold: ${this.slowThreshold}ms, limit: ${this.slowLimit})`
			);
		} else {
			this.lastFrameTime = performance.now();
			this.rafId = requestAnimationFrame(this.tickRaf);
			console.info(
				`Performance monitor: Using rAF fallback ` +
					`(threshold: ${this.slowThreshold}ms, limit: ${this.slowLimit})`
			);
		}
	}

	private tickRaf = (): void => {
		const now = performance.now();
		const delta = now - this.lastFrameTime;
		this.lastFrameTime = now;

		if (delta >= this.slowThreshold) {
			this.recordSlow(delta, 'rAF');
		}

		if (this.rafId !== null) {
			this.rafId = requestAnimationFrame(this.tickRaf);
		}
	};

	private recordSlow(duration: number, source: string): void {
		this.slowEventCount++;

		console.warn(
			`Performance monitor: Slow frame (${source}) — ` +
				`duration: ${Math.round(duration)}ms, ` +
				`count: ${this.slowEventCount}/${this.slowLimit}`
		);

		if (this.slowEventCount >= this.slowLimit) {
			console.warn(
				`Performance monitor: GPU/CPU overload detected ` +
					`(${this.slowEventCount} slow frames ≥${this.slowThreshold}ms)`
			);
			this.onOverload({
				slowEventCount: this.slowEventCount,
				lastDuration: duration,
			});
			this.stop();
		}
	}

	stop(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
	}

	getStats(): { slowEventCount: number } {
		return { slowEventCount: this.slowEventCount };
	}
}

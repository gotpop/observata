/**
 * GPU/CPU overload detection using PerformanceObserver.
 *
 * Uses two entry types:
 * - `longtask` — tasks blocking the main thread >50ms (wide browser support)
 * - `long-animation-frame` — frames exceeding 50ms (Chrome 123+, more granular)
 *
 * Tracks consecutive slow events. If the threshold is exceeded for the
 * configured number of consecutive checks, fires the onOverload callback.
 */

type PerformanceMonitorOptions = {
	/** Minimum event duration (ms) to count as "slow". Default: 100 */
	slowThreshold?: number;
	/** Number of consecutive slow events before triggering overload. Default: 5 */
	consecutiveLimit?: number;
	/** Callback fired when GPU/CPU overload is detected */
	onOverload: (stats: { slowEventCount: number; lastDuration: number }) => void;
};

export class PerformanceMonitor {
	private slowEventCount = 0;
	private observer: PerformanceObserver | null = null;
	private readonly slowThreshold: number;
	private readonly consecutiveLimit: number;
	private readonly onOverload: PerformanceMonitorOptions['onOverload'];

	constructor(options: PerformanceMonitorOptions) {
		this.slowThreshold = options.slowThreshold ?? 100;
		this.consecutiveLimit = options.consecutiveLimit ?? 5;
		this.onOverload = options.onOverload;
	}

	start(): void {
		if (this.observer) return;

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

		if (entryTypes.length === 0) {
			console.warn('Performance monitor: No supported entry types (longtask/long-animation-frame)');
			return;
		}

		this.observer = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (entry.duration >= this.slowThreshold) {
					this.slowEventCount++;

					console.warn(
						`Performance monitor: Slow event detected (${entry.entryType}) — ` +
							`duration: ${Math.round(entry.duration)}ms, ` +
							`consecutive slow events: ${this.slowEventCount}/${this.consecutiveLimit}`
					);

					if (this.slowEventCount >= this.consecutiveLimit) {
						console.warn(
							`Performance monitor: GPU/CPU overload detected ` +
								`(${this.slowEventCount} consecutive slow events ≥${this.slowThreshold}ms)`
						);
						this.onOverload({
							slowEventCount: this.slowEventCount,
							lastDuration: entry.duration,
						});
						this.stop();
						return;
					}
				} else {
					// Reset counter on a healthy event
					if (this.slowEventCount > 0) {
						this.slowEventCount = 0;
					}
				}
			}
		});

		this.observer.observe({ entryTypes });
		console.info(
			`Performance monitor: Watching for slow events (threshold: ${this.slowThreshold}ms, limit: ${this.consecutiveLimit} consecutive)`
		);
	}

	stop(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		this.slowEventCount = 0;
	}

	getStats(): { slowEventCount: number } {
		return { slowEventCount: this.slowEventCount };
	}
}

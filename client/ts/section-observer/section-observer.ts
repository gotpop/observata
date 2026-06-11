const defaultOptions = {
	threshold: 0.4,
	marginTop: '200px',
	marginBottom: '0px',
	marginRight: '0px',
	marginLeft: '200px',
};

const observerCallback = (entries: IntersectionObserverEntry[]) => {
	for (const entry of entries) {
		if (entry.isIntersecting) {
			entry.target.classList.add('in-view');
		} else {
			entry.target.classList.remove('in-view');
		}
	}
};

const observers = new Map<string, IntersectionObserver>();

function getObserver(
	threshold: number,
	marginTop: string,
	marginBottom: string
): IntersectionObserver {
	const key = `${threshold}-${marginTop}-${marginBottom}`;

	if (!observers.has(key)) {
		const observer = new IntersectionObserver(observerCallback, {
			threshold,
			rootMargin: `${marginTop} ${defaultOptions.marginRight} ${marginBottom} ${defaultOptions.marginLeft}`,
		});

		observers.set(key, observer);
	}
	return observers.get(key)!;
}

export function initSectionObserver() {
	const sections = document.querySelectorAll<HTMLElement>('[data-observe="true"]');

	for (const section of sections) {
		const thresholdAttr = section.dataset.threshold;
		const marginTopAttr = section.dataset.marginTop;
		const marginBottomAttr = section.dataset.marginBottom;

		const threshold = thresholdAttr ? parseFloat(thresholdAttr) : defaultOptions.threshold;
		const marginTop = marginTopAttr || defaultOptions.marginTop;
		const marginBottom = marginBottomAttr || defaultOptions.marginBottom;

		const observer = getObserver(threshold, marginTop, marginBottom);

		observer.observe(section);
	}

	// Clean up observers when all observed sections have been seen
	// (one-shot: disconnect after elements enter viewport)
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) return;

		for (const [key, observer] of observers) {
			const entries = observer.takeRecords();
			const allInView = entries.every((entry) => entry.isIntersecting);

			if (allInView && entries.length > 0) {
				observer.disconnect();
				observers.delete(key);
			}
		}
	});
}

/** Disconnect all intersection observers. Call on SPA-style teardown if needed. */
export function disconnectAllObservers(): void {
	for (const observer of observers.values()) {
		observer.disconnect();
	}
	observers.clear();
}

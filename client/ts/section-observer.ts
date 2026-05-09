const defaultOptions = {
	threshold: 0.4,
	rootMargin: '200px 0px 0px 200px',
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

const observers = new Map<number, IntersectionObserver>();

function getObserver(threshold: number): IntersectionObserver {
	if (!observers.has(threshold)) {
		const observer = new IntersectionObserver(observerCallback, {
			threshold,
			rootMargin: defaultOptions.rootMargin,
		});
		observers.set(threshold, observer);
	}
	return observers.get(threshold)!;
}

export function initSectionObserver() {
	const sections = document.querySelectorAll<HTMLElement>('.section-block');

	for (const section of sections) {
		const thresholdAttr = section.dataset.threshold;
		const threshold = thresholdAttr ? parseFloat(thresholdAttr) : defaultOptions.threshold;
		const observer = getObserver(threshold);

		observer.observe(section);
	}
}

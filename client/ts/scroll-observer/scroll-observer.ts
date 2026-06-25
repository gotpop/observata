/**
 * Scroll-state observer — fallback for browsers without `view-timeline` support.
 *
 * Adds a `has-scrolled` class to `<html>` once the user scrolls past the
 * threshold, allowing CSS to drive scroll-based styling without relying on
 * scroll-driven animations (`view-timeline` / `animation-timeline`).
 */
const SCROLL_THRESHOLD = 100;
const SCROLLED_CLASS = 'has-scrolled';

export function initScrollObserver() {
	// Only activate when view-timeline is unsupported.
	if (!document.documentElement.classList.contains('no-view-timeline')) {
		return;
	}

	const html = document.documentElement;
	let ticking = false;

	const update = () => {
		html.classList.toggle(SCROLLED_CLASS, window.scrollY > SCROLL_THRESHOLD);
		ticking = false;
	};

	const onScroll = () => {
		if (!ticking) {
			window.requestAnimationFrame(update);
			ticking = true;
		}
	};

	// Set initial state, then listen for changes.
	update();
	window.addEventListener('scroll', onScroll, { passive: true });
}

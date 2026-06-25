/**
 * Scroll-state observer — fallback for browsers without `view-timeline` support.
 *
 * Adds a `has-scrolled` class to `<html>` once the user scrolls past the
 * threshold, allowing CSS to drive scroll-based styling without relying on
 * scroll-driven animations (`view-timeline` / `animation-timeline`).
 */
const SCROLL_THRESHOLD = 100;
const SCROLLED_CLASS = 'has-scrolled';
const SCROLLED_ONCE_CLASS = 'scrolled-once';

export function initScrollObserver() {
	// Only activate when view-timeline is unsupported.
	if (!document.documentElement.classList.contains('no-view-timeline')) {
		return;
	}

	const html = document.documentElement;
	let ticking = false;

	const update = () => {
		const pastThreshold = window.scrollY > SCROLL_THRESHOLD;
		html.classList.toggle(SCROLLED_CLASS, pastThreshold);

		// Sticky flag: once the user has scrolled, allow the reverse animation
		// to play when they scroll back to the top (never removed).
		if (pastThreshold) {
			html.classList.add(SCROLLED_ONCE_CLASS);
		}

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

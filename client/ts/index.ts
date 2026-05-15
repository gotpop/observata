import './header-navigation';
import './pricing-tabs';

import { initSectionObserver } from './section-observer';
import { initCardGeoShader } from './shaders/card-geo-shader';
import { initHeroShaders } from './shaders/home';
import { initSubpageShaders } from './shaders/subpage';
import { createMatchMedia } from './utils/breakpoints';

document.addEventListener('DOMContentLoaded', () => {
	const mq = createMatchMedia('md');

	if (mq.matches) {
		void initHeroShaders();
		void initSubpageShaders();

		const canvases = document.querySelectorAll<HTMLCanvasElement>('.card-geo-shader canvas');

		for (const canvas of canvases) {
			void initCardGeoShader(canvas);
		}
	}

	initSectionObserver();
});

// view-transitions.ts
(function () {
	// State management
	let isViewTransitionBroken = false;
	let isNavigating = false;
	let currentTransition: ViewTransition | null = null;

	// Check if browser supports View Transitions API
	if (!document.startViewTransition) {
		console.warn('View Transitions API not supported in this browser');
		return;
	}

	/**
	 * Safely navigate using view transitions with error handling
	 */
	async function navigateWithTransition(url: string): Promise<void> {
		// Don't navigate to the same page
		if (url === window.location.href) return;

		// Cancel any ongoing transition
		if (currentTransition) {
			try {
				currentTransition.skipTransition();
			} catch (e) {
				// Ignore skip errors
			}
			currentTransition = null;
		}

		isNavigating = true;

		try {
			// Start the view transition
			const transition = document.startViewTransition(() => {
				window.location.href = url;
			});

			currentTransition = transition;

			// Wait for the transition to complete
			await transition.finished;
		} catch (error) {
			// Handle AbortError specifically
			if (error instanceof Error && error.name === 'AbortError') {
				console.warn('View transition was aborted:', error.message);

				// Mark the API as broken to prevent future transitions from getting stuck
				isViewTransitionBroken = true;

				// Fall back to normal navigation without transition
				window.location.href = url;
			} else {
				// Handle other errors
				console.error('Unexpected error during view transition:', error);
				window.location.href = url;
			}
		} finally {
			isNavigating = false;
			currentTransition = null;
		}
	}

	/**
	 * Handle click events on anchor tags
	 */
	function handleLinkClick(event: MouseEvent): void {
		// Don't interfere with modifier keys or right-clicks
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
			return;
		}

		// Find the closest anchor tag
		const anchor = (event.target as HTMLElement).closest('a');
		if (!anchor) return;

		// Get the target URL
		const url = anchor.href;

		// Validate the link:
		// - Must be same origin
		// - Not a download link
		// - Not targeting a new window
		// - Not a javascript: pseudo-protocol
		// - Not a hash-only navigation
		if (
			!url.startsWith(window.location.origin) ||
			anchor.hasAttribute('download') ||
			anchor.target === '_blank' ||
			url.startsWith('javascript:') ||
			url === window.location.href ||
			(anchor.getAttribute('href') || '').startsWith('#')
		) {
			return;
		}

		// If the API is in a broken state, don't intercept - let normal navigation happen
		if (isViewTransitionBroken) {
			return;
		}

		// If already navigating, prevent duplicate attempts
		if (isNavigating) {
			event.preventDefault();
			return;
		}

		// Intercept the navigation
		event.preventDefault();
		navigateWithTransition(url);
	}

	/**
	 * Reset the broken state when the page loads/shows
	 */
	function resetBrokenState(): void {
		isViewTransitionBroken = false;
		isNavigating = false;
		currentTransition = null;
	}

	/**
	 * Handle back/forward navigation (popstate)
	 */
	function handlePopState(): void {
		if (isViewTransitionBroken) {
			// If API is broken, just reload to reset everything
			window.location.reload();
			return;
		}

		// Reset state on popstate to allow new transitions
		resetBrokenState();
	}

	/**
	 * Handle page visibility changes (user switches tabs)
	 */
	function handleVisibilityChange(): void {
		if (document.hidden && currentTransition) {
			// If user switches tabs during transition, mark as potentially broken
			console.debug('Page hidden during transition - may cause abort');
		}
	}

	/**
	 * Setup all event listeners
	 */
	function setupEventListeners(): void {
		// Intercept link clicks
		document.addEventListener('click', handleLinkClick);

		// Handle back/forward navigation
		window.addEventListener('popstate', handlePopState);

		// Handle page show (bfcache, initial load)
		window.addEventListener('pageshow', resetBrokenState);

		// Handle visibility changes
		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Optional: Handle online/offline status
		window.addEventListener('online', resetBrokenState);
	}

	/**
	 * Clean up event listeners (useful for SPAs or hot reloading)
	 */
	function cleanup(): void {
		document.removeEventListener('click', handleLinkClick);
		window.removeEventListener('popstate', handlePopState);
		window.removeEventListener('pageshow', resetBrokenState);
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		window.removeEventListener('online', resetBrokenState);
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', setupEventListeners);
	} else {
		setupEventListeners();
	}

	// Export cleanup function for hot reloading (if needed)
	if (typeof module !== 'undefined' && module.hot) {
		module.hot.dispose(cleanup);
	}

	// Optional: Expose debug info to window (remove in production)
	if (process.env.NODE_ENV === 'development') {
		(window as any).__viewTransitions = {
			isBroken: () => isViewTransitionBroken,
			isNavigating: () => isNavigating,
			reset: resetBrokenState,
			cleanup,
		};
	}
})();

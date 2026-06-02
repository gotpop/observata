let clickOutsideHandler: ((e: MouseEvent) => void) | null = null;

/**
 * Sets up a click event listener that closes the specified content when clicking outside of it
 * @param trigger - The trigger element that opens/closes the content
 * @param content - The content element that should close when clicking outside
 * @param onOutsideClick - Optional callback to execute when clicking outside
 */
export function setupClickOutsideClose(
	trigger: HTMLElement | null,
	content: HTMLElement | null,
	onOutsideClick?: () => void
): void {
	if (!trigger || !content) return;

	// Remove any existing handler first
	removeClickOutsideClose();

	clickOutsideHandler = (e: MouseEvent) => {
		const isOpen = content.classList.contains('is-open');
		if (!isOpen) return;

		const target = e.target as Node;

		// Check if the click is outside the content and trigger
		const isClickOutside = !content.contains(target) && !trigger.contains(target);

		if (isClickOutside) {
			content.classList.remove('is-open');
			trigger.setAttribute('aria-expanded', 'false');
			content.setAttribute('aria-expanded', 'false');

			const label = trigger.querySelector('.sr-only');
			if (label) {
				label.textContent = 'Open menu';
			}

			// Execute custom callback if provided
			if (onOutsideClick) {
				onOutsideClick();
			}

			// Remove the handler after closing
			removeClickOutsideClose();
		}
	};

	document.addEventListener('click', clickOutsideHandler);
}

/**
 * Removes the click outside event listener
 */
export function removeClickOutsideClose(): void {
	if (clickOutsideHandler) {
		document.removeEventListener('click', clickOutsideHandler);
		clickOutsideHandler = null;
	}
}

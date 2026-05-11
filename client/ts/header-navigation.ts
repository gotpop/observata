import { createMatchMedia } from './utils/breakpoints';

document.addEventListener('DOMContentLoaded', () => {
	const trigger = document.getElementById('trigger-navigation');
	const headerContent = document.getElementById('header-content');
	const parentMenuItems = document.querySelectorAll('.menu-item-has-children');

	const mq = createMatchMedia('sm');

	// --- Mobile nav trigger ---
	if (trigger && headerContent) {
		trigger.addEventListener('click', () => {
			const isOpen = headerContent.classList.toggle('is-open');

			trigger.setAttribute('aria-expanded', String(isOpen));
			const label = trigger.querySelector('.sr-only');

			if (label) {
				label.textContent = isOpen ? 'Close menu' : 'Open menu';
			}

			const hasOpenClass = headerContent.classList.contains('is-open');
			const iconHamburger = document.getElementById('icon-hamburger');

			if (iconHamburger) {
				iconHamburger.classList.toggle('is-active', hasOpenClass);
			}
		});
	}

	// --- Submenu toggle: aria-expanded ---
	function handleSubmenuEnter(e: Event) {
		const parent = e.currentTarget as HTMLElement;
		const button = parent.querySelector('.menu-button') as HTMLElement;

		if (button) button.setAttribute('aria-expanded', 'true');
	}

	function handleSubmenuLeave(e: Event) {
		const parent = e.currentTarget as HTMLElement;
		const button = parent.querySelector('.menu-button') as HTMLElement;

		if (button) button.setAttribute('aria-expanded', 'false');
	}

	function handleSubmenuClick(e: Event) {
		e.preventDefault();

		const el = e.currentTarget as HTMLElement;
		const isExpanded = el.getAttribute('aria-expanded') === 'true';
		el.setAttribute('aria-expanded', String(!isExpanded));
	}

	function attachListeners() {
		parentMenuItems.forEach((parentItem) => {
			const button = parentItem.querySelector('.menu-button') as HTMLElement;

			if (mq.matches) {
				parentItem.addEventListener('mouseenter', handleSubmenuEnter);
				parentItem.addEventListener('mouseleave', handleSubmenuLeave);

				if (button) button.removeEventListener('click', handleSubmenuClick);
			} else {
				parentItem.removeEventListener('mouseenter', handleSubmenuEnter);
				parentItem.removeEventListener('mouseleave', handleSubmenuLeave);

				if (button) button.addEventListener('click', handleSubmenuClick);
			}
		});
	}

	attachListeners();
	mq.addEventListener('change', attachListeners);
});

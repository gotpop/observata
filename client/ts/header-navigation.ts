document.addEventListener('DOMContentLoaded', () => {
	const trigger = document.getElementById('trigger-navigation');
	const headerContent = document.getElementById('header-content');
	const menuItemsWithChildren = document.querySelectorAll('.menu-item-has-children > .menu-button');

	const mq = window.matchMedia('(width >= 40rem)');

	function isDesktop(): boolean {
		return mq.matches;
	}

	// --- Mobile nav trigger ---
	if (trigger && headerContent) {
		trigger.addEventListener('click', () => {
			const isOpen = headerContent.classList.toggle('is-open');
			trigger.setAttribute('aria-expanded', String(isOpen));
			const label = trigger.querySelector('.sr-only');
			if (label) {
				label.textContent = isOpen ? 'Close menu' : 'Open menu';
			}
		});
	}

	// --- Submenu toggle: aria-expanded ---
	function handleSubmenuEnter(e: Event) {
		const el = e.currentTarget as HTMLElement;
		el.setAttribute('aria-expanded', 'true');
	}

	function handleSubmenuLeave(e: Event) {
		const el = e.currentTarget as HTMLElement;
		el.setAttribute('aria-expanded', 'false');
	}

	function handleSubmenuClick(e: Event) {
		e.preventDefault();
		const el = e.currentTarget as HTMLElement;
		const isExpanded = el.getAttribute('aria-expanded') === 'true';
		el.setAttribute('aria-expanded', String(!isExpanded));
	}

	function attachListeners() {
		menuItemsWithChildren.forEach((menuItem) => {
			if (isDesktop()) {
				menuItem.addEventListener('mouseenter', handleSubmenuEnter);
				menuItem.addEventListener('mouseleave', handleSubmenuLeave);
				menuItem.removeEventListener('click', handleSubmenuClick);
			} else {
				menuItem.removeEventListener('mouseenter', handleSubmenuEnter);
				menuItem.removeEventListener('mouseleave', handleSubmenuLeave);
				menuItem.addEventListener('click', handleSubmenuClick);
			}
		});
	}

	attachListeners();
	mq.addEventListener('change', attachListeners);
});

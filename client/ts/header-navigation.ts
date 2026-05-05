document.addEventListener('DOMContentLoaded', () => {
	const trigger = document.getElementById('trigger-navigation');
	const headerContent = document.getElementById('header-content');

	if (trigger && headerContent) {
		trigger.addEventListener('click', () => {
			const isOpen = headerContent.classList.toggle('open');
			trigger.setAttribute('aria-expanded', String(isOpen));
			const label = trigger.querySelector('.sr-only');
			if (label) {
				label.textContent = isOpen ? 'Close menu' : 'Open menu';
			}
		});
	}

	// Toggle submenu aria-expanded on menu items with children
	const menuItemsWithChildren = document.querySelectorAll('.menu-item-has-children > .menu-link');
	menuItemsWithChildren.forEach((menuItem) => {
		menuItem.addEventListener('click', (e) => {
			e.preventDefault();
			const el = e.currentTarget as HTMLElement;
			const isExpanded = el.getAttribute('aria-expanded') === 'true';
			el.setAttribute('aria-expanded', String(!isExpanded));
		});
	});
});

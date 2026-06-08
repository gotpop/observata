export function handleTriggerClick(
	trigger: HTMLElement | null,
	headerContent: HTMLElement | null
): boolean {
	if (!trigger || !headerContent) return false;

	const isOpen = headerContent.classList.toggle('is-open');

	trigger.setAttribute('aria-expanded', String(isOpen));
	headerContent.setAttribute('aria-expanded', String(isOpen));
	const label = trigger.querySelector('.sr-only');

	if (label) {
		label.textContent = isOpen ? 'Close menu' : 'Open menu';
	}

	const hasOpenClass = headerContent.classList.contains('is-open');
	const iconHamburger = document.getElementById('icon-hamburger');

	if (iconHamburger) {
		iconHamburger.classList.toggle('is-active', hasOpenClass);
	}

	return isOpen;
}

export function handleSubmenuEnter(e: Event): void {
	const parent = e.currentTarget as HTMLElement;
	const button = parent.querySelector('.menu-button') as HTMLElement;

	if (button) button.setAttribute('aria-expanded', 'true');
}

export function handleSubmenuLeave(e: Event): void {
	const parent = e.currentTarget as HTMLElement;
	const button = parent.querySelector('.menu-button') as HTMLElement;

	if (button) button.setAttribute('aria-expanded', 'false');
}

export function handleSubmenuClick(e: Event): void {
	e.preventDefault();

	const el = e.currentTarget as HTMLElement;
	const isExpanded = el.getAttribute('aria-expanded') === 'true';

	closeAllSubmenus(el);
	el.setAttribute('aria-expanded', String(!isExpanded));
}

export function handleSubmenuKeydown(e: KeyboardEvent): void {
	const el = e.currentTarget as HTMLElement;
	const parentItem = el.closest('.menu-item-has-children') as HTMLElement;

	switch (e.key) {
		case 'Enter':
		case ' ':
			e.preventDefault();
			handleSubmenuClick(e);
			break;
		case 'Escape':
			closeAllSubmenus(el);
			el.setAttribute('aria-expanded', 'false');
			el.focus();
			break;
		case 'ArrowDown': {
			e.preventDefault();
			const submenu = parentItem?.querySelector('.submenu');
			if (submenu) {
				const firstLink = submenu.querySelector('a') as HTMLElement;
				if (firstLink) firstLink.focus();
			}
			break;
		}
	}
}

export function handleSubmenuLinkKeydown(e: KeyboardEvent): void {
	const submenu = (e.currentTarget as HTMLElement).closest('.submenu') as HTMLElement;
	const links = submenu ? Array.from(submenu.querySelectorAll('a')) : [];
	const i = links.indexOf(e.currentTarget as HTMLElement);

	switch (e.key) {
		case 'ArrowDown':
			e.preventDefault();
			if (links[i + 1]) links[i + 1].focus();
			break;
		case 'ArrowUp':
			e.preventDefault();
			if (i > 0) links[i - 1].focus();
			else {
				const trigger = submenu?.parentElement?.previousElementSibling as HTMLElement;
				if (trigger) trigger.focus();
			}
			break;
		case 'Escape': {
			const trigger = submenu?.parentElement?.previousElementSibling as HTMLElement;
			if (trigger) {
				closeAllSubmenus(trigger);
				trigger.setAttribute('aria-expanded', 'false');
				trigger.focus();
			}
			break;
		}
	}
}

function closeAllSubmenus(except?: HTMLElement): void {
	const allTriggers = document.querySelectorAll(
		'.menu-button[aria-expanded], .menu-anchor[aria-haspopup]'
	);
	allTriggers.forEach((t) => {
		if (t !== except) {
			(t as HTMLElement).setAttribute('aria-expanded', 'false');
		}
	});
}

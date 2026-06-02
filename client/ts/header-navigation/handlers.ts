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

	el.setAttribute('aria-expanded', String(!isExpanded));
}

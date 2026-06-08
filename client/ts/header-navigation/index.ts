import { createMatchMedia, setupClickOutsideClose } from '../utils';
import {
	handleSubmenuClick,
	handleSubmenuEnter,
	handleSubmenuKeydown,
	handleSubmenuLeave,
	handleSubmenuLinkKeydown,
	handleTriggerClick,
} from './handlers';

export function initHeaderNavigation(): void {
	const trigger = document.getElementById('trigger-navigation');
	const headerContent = document.getElementById('header-content');
	const parentMenuItems = document.querySelectorAll('.menu-item-has-children');

	const mq = createMatchMedia('sm');

	if (trigger && headerContent) {
		trigger.addEventListener('click', () => {
			const isOpen = handleTriggerClick(trigger, headerContent);
			if (isOpen) {
				setupClickOutsideClose(trigger, headerContent, () => {
					const iconHamburger = document.getElementById('icon-hamburger');
					if (iconHamburger) {
						iconHamburger.classList.remove('is-active');
					}
				});
			}
		});
	}

	function attachListeners() {
		parentMenuItems.forEach((parentItem) => {
			const menuTrigger = parentItem.querySelector(
				'.menu-button, .menu-anchor[aria-haspopup]'
			) as HTMLElement;

			// Click + keyboard always attached (both mobile & desktop)
			if (menuTrigger) {
				menuTrigger.removeEventListener('click', handleSubmenuClick);
				menuTrigger.removeEventListener('keydown', handleSubmenuKeydown);
				menuTrigger.addEventListener('click', handleSubmenuClick);
				menuTrigger.addEventListener('keydown', handleSubmenuKeydown);
			}

			const submenuLinks = parentItem.querySelectorAll<HTMLElement>('.submenu a');

			submenuLinks.forEach((link) => {
				link.removeEventListener('keydown', handleSubmenuLinkKeydown);
				link.addEventListener('keydown', handleSubmenuLinkKeydown);
			});

			// Desktop-only hover behaviour
			if (mq.matches) {
				parentItem.addEventListener('mouseenter', handleSubmenuEnter);
				parentItem.addEventListener('mouseleave', handleSubmenuLeave);
			} else {
				parentItem.removeEventListener('mouseenter', handleSubmenuEnter);
				parentItem.removeEventListener('mouseleave', handleSubmenuLeave);
			}
		});
	}

	attachListeners();
	mq.addEventListener('change', attachListeners);
}

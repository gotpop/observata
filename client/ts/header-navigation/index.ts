import { handleSubmenuClick, handleSubmenuEnter, handleSubmenuLeave, handleTriggerClick } from './handlers';

import { createMatchMedia } from '../utils';

export function initHeaderNavigation(): void {
	const trigger = document.getElementById('trigger-navigation');
	const headerContent = document.getElementById('header-content');
	const parentMenuItems = document.querySelectorAll('.menu-item-has-children');

	const mq = createMatchMedia('sm');

	if (trigger && headerContent) {
		trigger.addEventListener('click', () => handleTriggerClick(trigger, headerContent));
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
}

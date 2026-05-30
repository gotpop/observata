import { initHeaderNavigation } from './header-navigation';
import { initPricingTabs } from './pricing-tabs';
import { initSectionObserver } from './section-observer';
import { initShaders } from './shaders';

document.addEventListener('DOMContentLoaded', () => {
	initShaders();
	initSectionObserver();
	initHeaderNavigation();
	initPricingTabs();
});

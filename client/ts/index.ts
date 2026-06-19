// Side-effect import: registers the <shader-card> custom element.
import './components/shader-card';

import { initHeaderNavigation } from './header-navigation';
import { initSectionObserver } from './section-observer';
import { initSectionTabs } from './section-tabs';
import { initShaders } from './shaders';

document.addEventListener('DOMContentLoaded', () => {
	initShaders();
	initSectionObserver();
	initHeaderNavigation();
	initSectionTabs();
});

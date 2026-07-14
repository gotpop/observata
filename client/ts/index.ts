import './components/shader-card';

import { detectCssFeature } from './utils';
import { initHeaderNavigation } from './header-navigation';
import { initScrollObserver } from './scroll-observer';
import { initSectionObserver } from './section-observer';
import { initSectionTabs } from './section-tabs';
import { initShaders } from './shaders';
import { initSphereAnimation } from './sphere-animation';

// Run as early as possible — documentElement is available before DOMContentLoaded.
detectCssFeature('animation-timeline', 'scroll()', 'no-view-timeline');

document.addEventListener('DOMContentLoaded', () => {
	initShaders();
	initSectionObserver();
	initSphereAnimation();
	initHeaderNavigation();
	initSectionTabs();
	initScrollObserver();
});

import './header-navigation';
import './shaders/home';
import './shaders/subpage';
import './pricing-tabs';

import { initCardGeoShader } from './shaders/card-geo-shader';
import { initSectionObserver } from './section-observer';

document.addEventListener('DOMContentLoaded', () => {
	const canvases = document.querySelectorAll<HTMLCanvasElement>('.card-geo-shader canvas');
	for (const canvas of canvases) {
		void initCardGeoShader(canvas);
	}

	initSectionObserver();
});

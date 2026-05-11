import './header-navigation';
import './pricing-tabs';

import { initSectionObserver } from './section-observer';
import { createMatchMedia } from './utils/breakpoints';

document.addEventListener('DOMContentLoaded', () => {
	const mq = createMatchMedia('sm');

	if (mq.matches) {
		void import('./shaders/home');
		void import('./shaders/subpage');

		const canvases = document.querySelectorAll<HTMLCanvasElement>('.card-geo-shader canvas');

		for (const canvas of canvases) {
			void import('./shaders/card-geo-shader').then(({ initCardGeoShader }) => {
				void initCardGeoShader(canvas);
			});
		}
	}

	initSectionObserver();
});

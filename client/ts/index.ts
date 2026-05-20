import './header-navigation';
import './pricing-tabs';

import { initSectionObserver } from './section-observer';
import { initCardGeoShader } from './shaders/card-geo-shader';
import { initHeroShaders } from './shaders/home';
import { initSubpageShaders } from './shaders/subpage';
import { createMatchMedia } from './utils/breakpoints';

document.addEventListener('DOMContentLoaded', () => {
	const mq = createMatchMedia('md');

	if (mq.matches) {
		void initHeroShaders();
		void initSubpageShaders();

		const canvases = document.querySelectorAll<HTMLCanvasElement>('.card-geo-shader canvas');

		for (const canvas of canvases) {
			void initCardGeoShader(canvas);
		}
	}

	initSectionObserver();
});

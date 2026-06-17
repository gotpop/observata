import { createMatchMedia, deferUntilIdle } from '../utils';

import { initCardGeoShader } from './card-geo-shader';
import { initSubpageShaders } from './subpage';

export function initShaders(): void {
	const subpageCanvas = document.querySelector('.subpage-shader');

	if (subpageCanvas && createMatchMedia('md').matches) {
		void initSubpageShaders();
	}

	// Defer non-hero shaders so the hero gets full GPU priority.
	deferUntilIdle(() => {
		const canvases = document.querySelectorAll<HTMLCanvasElement>('.card-geo-shader canvas');

		for (const canvas of canvases) {
			void initCardGeoShader(canvas);
		}
	});
}

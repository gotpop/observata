import { initCardGeoShader } from './card-geo-shader';
import { initHeroShaders } from './home';
import { initSubpageShaders } from './subpage';

export function initShaders(): void {
	const heroCanvas = document.getElementById('hero-shader');

	if (heroCanvas) {
		void initHeroShaders();
	}

	const subpageCanvas = document.querySelector('.subpage-shader');

	if (subpageCanvas) {
		void initSubpageShaders();
	}

	const canvases = document.querySelectorAll<HTMLCanvasElement>('.card-geo-shader canvas');

	for (const canvas of canvases) {
		void initCardGeoShader(canvas);
	}
}

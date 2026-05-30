import { createMatchMedia } from '../utils/breakpoints';
import { initCardGeoShader } from './card-geo-shader';
import { initHeroShaders } from './home';
import { initSubpageShaders } from './subpage';

export function initShaders(): void {
	const mq = createMatchMedia('md');

	if (mq.matches) {
		void initHeroShaders();
		void initSubpageShaders();

		const canvases = document.querySelectorAll<HTMLCanvasElement>('.card-geo-shader canvas');

		for (const canvas of canvases) {
			void initCardGeoShader(canvas);
		}
	}
}

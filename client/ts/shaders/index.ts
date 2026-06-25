import { createMatchMedia } from '../utils';
import { initSubpageShaders } from './subpage';

export function initShaders(): void {
	const subpageCanvas = document.querySelector('.subpage-shader');

	if (subpageCanvas && createMatchMedia('md').matches) {
		void initSubpageShaders();
	}
}

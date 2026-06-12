import { createShader } from 'shaders/js';

let activeShader: Awaited<ReturnType<typeof createShader>> | null = null;
let activeCanvas: HTMLCanvasElement | null = null;

export const destroyShader = () => {
	if (activeShader) {
		console.info('Shader: Destroying');

		activeShader.destroy();
		activeShader = null;
	}

	if (activeCanvas) {
		delete activeCanvas.dataset.shaderInitialized;
	}

	activeCanvas = null;
};

export const setActiveShader = (
	shader: Awaited<ReturnType<typeof createShader>> | null,
	canvas: HTMLCanvasElement
) => {
	activeShader = shader;
	activeCanvas = canvas;
};

export const getActiveShader = () => activeShader;

export const createVisibilityHandler = (reinit: () => Promise<void>) => {
	let attached = false;

	const handler = () => {
		if (document.hidden) {
			destroyShader();
		} else {
			void reinit();
		}
	};

	return {
		attach: () => {
			if (attached) return;

			document.addEventListener('visibilitychange', handler);
			attached = true;
		},
	};
};

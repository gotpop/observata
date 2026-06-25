export const prepareCanvas = (selector: string): HTMLCanvasElement | null => {
	const canvas = document.querySelector(selector) as HTMLCanvasElement | null;

	if (!canvas) {
		console.warn(`Shader: Canvas "${selector}" not found`);

		return null;
	}

	if (canvas.dataset.shaderInitialized === 'true') {
		console.info('Shader: Already initialized, skipping');

		return null;
	}

	if (!window.isSecureContext || !('gpu' in navigator)) {
		console.warn(
			'Shader: Needs HTTPS or localhost with WebGPU support. Current origin:',
			window.location.origin
		);

		return null;
	}

	return canvas;
};

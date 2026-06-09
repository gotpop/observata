import { COLOUR_BLUE, COLOUR_BLUE_LIGHT, COLOUR_PINK, type ShaderColors } from './colours';

import { createShader } from 'shaders/js';

function getSubpageShaderConfig({ colorA, colorB }: ShaderColors) {
	return {
		components: [
			{
				type: 'Form3D',
				id: 'idmmr8zyxrodm90feqn',
				props: {
					center: {
						x: 0.332,
						y: 0.75,
					},
					glossiness: 200,
					lighting: 197,
					shape3d: {
						type: 'ribbon',
						angle: 138,
						twist: 24,
						width: 73,
						thickness: 20,
						seed: 21.2,
					},
					shape3dType: 'ribbon',
					speed: 0,
					zoom: 56,
				},
				children: [
					{
						type: 'Swirl',
						id: 'idmmr8zwtuhz62buy44',
						props: {
							colorA,
							colorB,
							colorSpace: 'oklab',
							detail: 1.9,
						},
					},
					{
						type: 'FallingLines',
						id: 'idmmr93vzo731cyb4y3',
						props: {
							angle: 0,
							blendMode: 'linearDodge',
							colorB: '#000000',
							density: 13,
							opacity: 0.47,
							speed: 0.1,
							strokeWidth: 0.16,
							trailLength: 0.72,
							transform: {
								scale: 0.79,
								offsetX: -0.16,
							},
						},
					},
				],
			},
			{
				type: 'FilmGrain',
				id: 'idmmr97z6pijyaz1v1u',
				props: {
					strength: 0.32,
					visible: true,
				},
			},
		],
	};
}

const initSubpageShaders = async () => {
	const canvas = document.querySelector('.subpage-shader') as HTMLCanvasElement | null;

	if (!canvas) {
		console.warn('Subpage shader: Canvas element not found');

		return;
	}

	canvas.style.width = '1540px';
	canvas.style.height = '1000px';

	if (!window.isSecureContext || !('gpu' in navigator)) {
		console.warn(
			'Subpage shader: Shaders need HTTPS or localhost with WebGPU support. Current origin:',
			window.location.origin
		);

		return;
	}

	if (canvas.dataset.shaderInitialized === 'true') {
		console.info('Subpage shader: Already initialized, skipping');

		return;
	}

	canvas.dataset.shaderInitialized = 'true';

	const colourMap: Record<string, ShaderColors> = {
		'shader-pink': COLOUR_PINK,
		'shader-blueLight': COLOUR_BLUE_LIGHT,
		'shader-blue': COLOUR_BLUE,
	};

	const colours = colourMap[canvas.id] ?? COLOUR_BLUE;

	const config = getSubpageShaderConfig(colours);

	try {
		console.info('Subpage shader: Initializing...');
		await createShader(canvas, config, {
			observeElement: false,
			onReady: () => {
				canvas.classList.add('loaded');
			},
		});
		console.info('Subpage shader: Successfully loaded');
	} catch (error) {
		console.error('Subpage shader: Failed to initialize', error);
		delete canvas.dataset.shaderInitialized;
	}
};

export { initSubpageShaders };

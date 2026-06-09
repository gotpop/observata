import { COLOUR_BLUE } from './colours';
import { createShader } from 'shaders/js';

const heroShaderConfig = {
	components: [
		{
			type: 'Form3D',
			id: 'idmmr8zyxrodm90feqn',
			props: {
				center: {
					x: 0.97,
					y: 0.7,
				},
				glossiness: 200,
				lighting: 197,
				shape3d: {
					type: 'ribbon',
					angle: 0,
					twist: 24,
					width: 73,
					thickness: 20,
					seed: 25,
				},
				shape3dType: 'ribbon',
				speed: 0,
				zoom: 63,
			},
			children: [
				{
					type: 'Swirl',
					id: 'idmmr8zwtuhz62buy44',
					props: {
						colorA: COLOUR_BLUE.colorA,
						colorB: COLOUR_BLUE.colorB,
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
						opacity: 0.47,
						speed: 0.1,
						strokeWidth: 0.16,
						trailLength: 0.72,
						transform: {
							offsetX: -0.22,
							scale: 0.79,
						},
					},
				},
			],
		},
	],
};

const initHeroShaders = async () => {
	const canvas = document.getElementById('hero-shader') as HTMLCanvasElement;

	canvas.style.width = '1600px';
	canvas.style.height = '120%';

	if (!canvas) {
		console.warn('Hero shader: Canvas element not found');
		return;
	}

	if (!window.isSecureContext || !('gpu' in navigator)) {
		console.warn(
			'Hero shader: Shaders need HTTPS or localhost with WebGPU support. Current origin:',
			window.location.origin
		);
		return;
	}

	if (canvas.dataset.shaderInitialized === 'true') {
		console.info('Hero shader: Already initialized, skipping');
		return;
	}

	canvas.dataset.shaderInitialized = 'true';

	try {
		console.info('Hero shader: Initializing...');
		await createShader(canvas, heroShaderConfig, {
			// observeElement: false,
			onReady: () => {
				canvas.classList.add('loaded');
			},
		});
		console.info('Hero shader: Successfully loaded');
	} catch (error) {
		console.error('Hero shader: Failed to initialize', error);
		delete canvas.dataset.shaderInitialized;
	}
};

export { initHeroShaders };

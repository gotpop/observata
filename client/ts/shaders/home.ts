import { createShader } from 'shaders/js';

const heroShaderConfig = {
	components: [
		{
			type: 'Form3D',
			id: 'idmmr8zyxrodm90feqn',
			props: {
				center: {
					x: 0.81,
					y: 0.53,
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
						colorA: '#0598ce',
						colorB: '#133868',
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

const initHeroShaders = async () => {
	const canvas = document.getElementById('hero-shader') as HTMLCanvasElement | null;

	if (!canvas) return;

	// canvas.style.width = "1600px"
	// canvas.style.height = "340px"

	if (!window.isSecureContext || !('gpu' in navigator)) {
		console.warn('Shaders need HTTPS or localhost with WebGPU support. Current origin:', window.location.origin);
		return;
	}

	if (canvas.dataset.shaderInitialized === 'true') {
		return;
	}

	canvas.dataset.shaderInitialized = 'true';

	try {
		await createShader(canvas, heroShaderConfig);
	} catch (error) {
		console.error('Hero shader failed to initialize.', error);
		delete canvas.dataset.shaderInitialized;
	}
};

export { initHeroShaders };

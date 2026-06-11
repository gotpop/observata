import { createShader } from 'shaders/js';

const initHeroShaders = async () => {
	const canvas = document.getElementById('hero-shader') as HTMLCanvasElement | null;

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
		await createShader(
			canvas,
			{
				components: [
					{
						type: 'Form3D',
						id: 'idmmr8zyxrodm90feqn',
						props: {
							center: {
								x: 0.83,
								y: 0.76,
							},
							glossiness: 200,
							lighting: 197,
							shape3d: {
								type: 'ribbon',
								angle: 0,
								twist: 24,
								width: 73,
								thickness: 20,
								seed: 24.5,
							},
							shape3dType: 'ribbon',
							speed: 0,
							uvMode: 'mirror',
							zoom: 73,
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
								id: 'idmq9cbx8wqhsm96pxv',
								props: {
									angle: 180,
									blendMode: 'linearDodge',
									colorB: '#000000',
									opacity: 0.47,
									speed: 0.1,
									strokeWidth: 0.16,
									trailLength: 0.72,
									// density: 19,
									transform: {
										// offsetX: 0.22,
										scale: 0.79,
										anchorX: 1,
									},
								},
							},
						],
					},
				],
			},
			{
				onReady: () => {
					canvas.classList.add('loaded');
				},
			}
		);
		console.info('Hero shader: Successfully loaded');
	} catch (error) {
		console.error('Hero shader: Failed to initialize', error);
		delete canvas.dataset.shaderInitialized;
	}
};

export { initHeroShaders };

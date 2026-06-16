import { createShader } from 'shaders/js';
import { prepareCanvas } from './utils-shader/warnings';

const shaderConfig = {
	components: [
		{
			type: 'Form3D',
			id: 'idmmr8zyxrodm90feqn',
			props: {
				center: {
					x: 0.5,
					y: 0.5,
				},
				glossiness: 200,
				lighting: 197,
				shape3d: {
					type: 'ribbon',
					angle: 179.3,
					twist: 45,
					width: 39,
					thickness: 8,
					seed: 33,
				},
				shape3dType: 'ribbon',
				speed: 0,
				uvMode: 'mirror',
				zoom: 120,
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
						visible: true,
					},
				},
				{
					type: 'FallingLines',
					id: 'idmq9cbx8wqhsm96pxv',
					props: {
						angle: 0,
						blendMode: 'linearDodge',
						density: 19,
						opacity: 0.43,
						speed: 0.05,
						strokeWidth: 0.18,
						trailLength: 0.58,
						transform: {
							scale: 0.95,
							anchorX: 1,
						},
					},
				},
			],
		},
	],
};

const FALLING_LINES_ID = 'idmq9cbx8wqhsm96pxv';
const FALLING_LINES_BASE_SPEED = 0.05;
const FALLING_LINES_HOVER_SPEED = 0.15;

const initHeroShaders = async () => {
	const canvas = prepareCanvas('#hero-shader');

	if (!canvas) return;

	canvas.dataset.shaderInitialized = 'true';

	try {
		const shader = await createShader(canvas, shaderConfig, {
			enablePerformanceTracking: false,
			onReady: () => {
				canvas.style.width = '';
				canvas.style.height = '';
				canvas.classList.add('loaded');
			},
		});

		const cta = document.getElementById('cta-primary-hero');
		if (cta) {
			cta.addEventListener('mouseenter', () => {
				shader.update(FALLING_LINES_ID, { speed: FALLING_LINES_HOVER_SPEED });
			});
			cta.addEventListener('mouseleave', () => {
				shader.update(FALLING_LINES_ID, { speed: FALLING_LINES_BASE_SPEED });
			});
		}
	} catch (error) {
		console.error('Hero shader: Failed to initialize', error);

		delete canvas.dataset.shaderInitialized;
	}
};

export { initHeroShaders };

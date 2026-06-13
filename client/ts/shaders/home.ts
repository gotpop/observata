import { createShader } from 'shaders/js';
import { MQ_MAX } from '../utils/breakpoints';
import { prepareCanvas } from './utils-shader/warnings';

type Center = { x: number; y: number };

type Bp = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const CENTER_X: Record<Bp, number> = {
	xs: 0.65,
	sm: 0.67,
	md: 0.718,
	lg: 0.66,
	xl: 0.65,
	'2xl': 0.65,
};

const BP_TIERS: { bp: Bp; mq: keyof typeof MQ_MAX; range: string }[] = [
	{ bp: 'xs', mq: 'sm', range: '<40rem' },
	{ bp: 'sm', mq: 'md', range: '40-48rem' },
	{ bp: 'md', mq: 'lg', range: '48-64rem' },
	{ bp: 'lg', mq: 'xl', range: '64-80rem' },
	{ bp: 'xl', mq: '2xl', range: '80-96rem' },
];

const getCenter = (): { center: Center; bp: Bp; range: string } => {
	for (const { bp, mq, range } of BP_TIERS) {
		if (window.matchMedia(MQ_MAX[mq]).matches) {
			return { center: { x: CENTER_X[bp], y: 0.5 }, bp, range };
		}
	}

	return { center: { x: CENTER_X['2xl'], y: 0.5 }, bp: '2xl', range: '>=96rem' };
};

const shaderConfig = {
	components: [
		{
			type: 'Form3D',
			id: 'idmmr8zyxrodm90feqn',
			props: {
				center: { x: CENTER_X['2xl'], y: 0.5 },
				glossiness: 200,
				lighting: 197,
				shape3d: {
					type: 'ribbon',
					angle: 0,
					twist: 24,
					width: 73,
					thickness: 20,
					seed: 2,
				},
				shape3dType: 'ribbon',
				speed: 0,
				uvMode: 'mirror',
				zoom: 107.8,
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
						transform: {
							scale: 0.79,
							anchorX: 1,
						},
					},
				},
			],
		},
	],
};

const SHADER_ID = 'idmmr8zyxrodm90feqn';

const initHeroShaders = async () => {
	const canvas = prepareCanvas('hero-shader');

	if (!canvas) return;

	const { center, bp, range } = getCenter();

	console.info(`Shader: ${bp} (${range})`, center.x);
	canvas.dataset.shaderInitialized = 'true';

	try {
		const shader = await createShader(canvas, shaderConfig, {
			enablePerformanceTracking: false,
			onReady: () => {
				const { width, height } = canvas.getBoundingClientRect();
				shader.resize(Math.round(width), Math.round(height));

				// Clear inline styles so CSS media queries control display size;
				// the library's internal ResizeObserver still handles the drawing buffer
				canvas.style.width = '';
				canvas.style.height = '';

				shader.update(SHADER_ID, { center });
			},
		});
	} catch (error) {
		console.error('Hero shader: Failed to initialize', error);

		delete canvas.dataset.shaderInitialized;
	}
};

export { initHeroShaders };

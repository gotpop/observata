import { getActiveShader, setActiveShader } from './utils-shader/lifecycle';

import { createShader } from 'shaders/js';
import { BREAKPOINTS } from '../utils/breakpoints';
import { prepareCanvas } from './utils-shader/warnings';

type Center = { x: number; y: number };

type Bp = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const CENTER_X: Record<Bp, number> = {
	xs: 0.65,
	sm: 0.65,
	md: 0.67,
	lg: 0.66,
	xl: 0.65,
	'2xl': 0.65,
};

const BP_TIERS: { bp: Bp; max: number; range: string }[] = [
	{ bp: 'xs', max: BREAKPOINTS.sm, range: '<40rem' },
	{ bp: 'sm', max: BREAKPOINTS.md, range: '40-48rem' },
	{ bp: 'md', max: BREAKPOINTS.lg, range: '48-64rem' },
	{ bp: 'lg', max: BREAKPOINTS.xl, range: '64-80rem' },
	{ bp: 'xl', max: BREAKPOINTS['2xl'], range: '80-96rem' },
];

const getCenter = (): { center: Center; bp: Bp; range: string } => {
	const w = window.innerWidth;

	for (const { bp, max, range } of BP_TIERS) {
		if (w < max) return { center: { x: CENTER_X[bp], y: 0.5 }, bp, range };
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

	console.info(`Hero shader: ${bp} (${range})`, center);
	canvas.dataset.shaderInitialized = 'true';

	try {
		const shader = await createShader(canvas, shaderConfig, {
			enablePerformanceTracking: false,
			onReady: () => onShaderReady(canvas, center),
		});

		setActiveShader(shader, canvas);
	} catch (error) {
		console.error('Hero shader: Failed to initialize', error);

		setActiveShader(null, canvas);

		delete canvas.dataset.shaderInitialized;
	}
};

const onShaderReady = (canvas: HTMLCanvasElement, center: Center) => {
	canvas.classList.add('loaded');

	const { width, height } = canvas.getBoundingClientRect();
	const shader = getActiveShader()!;

	shader.resize(Math.round(width), Math.round(height));
	shader.update(SHADER_ID, { center });
};

export { initHeroShaders };

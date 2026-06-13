import {
	createVisibilityHandler,
	getActiveShader,
	setActiveShader,
} from './utils-shader/lifecycle';

import { createShader } from 'shaders/js';
import { MQ_MAX } from '../utils/breakpoints';
import { prepareCanvas } from './utils-shader/warnings';

type ShaderProfile = {
	width: string;
	height: string;
	center: { x: number; y: number };
};

type Profile = Record<'mobile' | 'tablet' | 'desktop', ShaderProfile>;

const PROFILES: Profile = {
	mobile: { width: '120%', height: '120px', center: { x: 0.65, y: 0.5 } },
	tablet: { width: '120%', height: '350px', center: { x: 0.74, y: 0.5 } },
	// desktop: { width: '1536px', height: '350px', center: { x: 0.635, y: 0.5 } },
	desktop: { width: '110%', height: '350px', center: { x: 0.635, y: 0.5 } },
};

const getProfile = (): ShaderProfile & { bp: string } => {
	if (window.matchMedia(MQ_MAX.md).matches) return { ...PROFILES.mobile, bp: 'mobile' };
	if (window.matchMedia(MQ_MAX.lg).matches) return { ...PROFILES.tablet, bp: 'tablet' };

	return { ...PROFILES.desktop, bp: 'desktop' };
};

const shaderConfig = {
	components: [
		{
			type: 'Form3D',
			id: 'idmmr8zyxrodm90feqn',
			props: {
				center: PROFILES.desktop.center,
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

const initHeroShaders = async () => {
	const canvas = prepareCanvas('hero-shader');

	if (!canvas) return;

	const { width, height, center, bp } = getProfile();

	console.info(`Hero shader: Active breakpoint → ${bp}`, { width, height, center });

	canvas.style.width = width;
	canvas.style.height = height;
	canvas.dataset.shaderInitialized = 'true';

	try {
		const shader = await createShader(canvas, shaderConfig, {
			enablePerformanceTracking: false,
			onReady: () => onShaderReady(canvas, center),
		});

		setActiveShader(shader, canvas);
		createVisibilityHandler(initHeroShaders).attach();
	} catch (error) {
		console.error('Hero shader: Failed to initialize', error);
		setActiveShader(null, canvas);

		delete canvas.dataset.shaderInitialized;
	}
};

const onShaderReady = (canvas: HTMLCanvasElement, center: { x: number; y: number }) => {
	canvas.classList.add('loaded');

	const { width, height } = canvas.getBoundingClientRect();
	const shader = getActiveShader()!;

	shader.resize(Math.round(width), Math.round(height));
	shader.update('idmmr8zyxrodm90feqn', { center });
};

export { initHeroShaders };

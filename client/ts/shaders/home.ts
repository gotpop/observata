import { MQ, MQ_MAX } from '../utils/breakpoints';

import { createShader } from 'shaders/js';

let activeShader: Awaited<ReturnType<typeof createShader>> | null = null;
let activeCanvas: HTMLCanvasElement | null = null;
let visibilityListenerAttached = false;

type ShaderProfile = {
	cssWidth: string;
	cssHeight: string;
	renderWidth?: number;
	renderHeight: number;
	center: { x: number; y: number };
};

const PROFILES: Record<'mobile' | 'tablet' | 'desktop', ShaderProfile> = {
	mobile: {
		cssWidth: '100%',
		cssHeight: '200px',
		renderHeight: 160,
		center: { x: 0.67, y: 0.5 },
	},
	tablet: {
		cssWidth: '1024px',
		cssHeight: '350px',
		renderWidth: 1024,
		renderHeight: 350,
		center: { x: 0.55, y: 0.5 },
	},
	desktop: {
		cssWidth: '1536px',
		cssHeight: '350px',
		renderWidth: 1536,
		renderHeight: 350,
		center: { x: 0.635, y: 0.5 },
	},
};

const getProfile = (): ShaderProfile => {
	if (window.matchMedia(MQ_MAX.md).matches) return PROFILES.mobile;
	if (window.matchMedia(MQ.lg).matches) return PROFILES.desktop;
	return PROFILES.tablet;
};

const destroyShader = () => {
	if (activeShader) {
		console.info('Hero shader: Destroying shader');

		activeShader.destroy();
		activeShader = null;
	}

	if (activeCanvas) {
		delete activeCanvas.dataset.shaderInitialized;
	}

	activeCanvas = null;
};

const handleVisibilityChange = () => {
	if (document.hidden) {
		console.info('Hero shader: Tab hidden, destroying shader');

		destroyShader();
	} else {
		console.info('Hero shader: Tab refocused, re-initializing shader');

		initHeroShaders();
	}
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
	const canvas = document.getElementById('hero-shader') as HTMLCanvasElement | null;

	if (!canvas) {
		console.warn('Hero shader: Canvas element not found');

		return;
	}

	const profile = getProfile();

	canvas.style.width = profile.cssWidth;
	canvas.style.height = profile.cssHeight;

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
		activeCanvas = canvas;
		activeShader = await createShader(canvas, shaderConfig, {
			observeElement: false,
			enablePerformanceTracking: false,
			onReady: () => {
				canvas.classList.add('loaded');
				const rw = profile.renderWidth ?? Math.round(canvas.getBoundingClientRect().width);
				activeShader!.resize(rw, profile.renderHeight);
				activeShader!.update('idmmr8zyxrodm90feqn', { center: profile.center });
			},
		});

		if (!visibilityListenerAttached) {
			document.addEventListener('visibilitychange', handleVisibilityChange);
			visibilityListenerAttached = true;
			console.info('Hero shader: visibilitychange listener attached');
		}

		console.info('Hero shader: Successfully loaded');
	} catch (error) {
		console.error('Hero shader: Failed to initialize', error);
		activeShader = null;
		activeCanvas = null;
		delete canvas.dataset.shaderInitialized;
	}
};

export { initHeroShaders };

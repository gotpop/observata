import { createShader } from 'shaders/js';
import { PerformanceMonitor } from '../utils';

let activeShader: Awaited<ReturnType<typeof createShader>> | null = null;
let activeCanvas: HTMLCanvasElement | null = null;
let visibilityListenerAttached = false;
let perfMonitor: PerformanceMonitor | null = null;

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
	perfMonitor?.stop();
	perfMonitor = null;
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
				center: {
					x: 0.63,
					y: 0.785,
				},
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

const SHADER_WIDTH = 1600;
const SHADER_HEIGHT = 830;

const initHeroShaders = async () => {
	const canvas = document.getElementById('hero-shader') as HTMLCanvasElement | null;

	if (!canvas) {
		console.warn('Hero shader: Canvas element not found');

		return;
	}

	canvas.style.width = `${SHADER_WIDTH}px`;
	canvas.style.height = `${SHADER_HEIGHT}px`;

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
			enablePerformanceTracking: true,
			onReady: () => {
				canvas.classList.add('loaded');
				activeShader!.resize(SHADER_WIDTH, SHADER_HEIGHT);
			},
		});

		if (!visibilityListenerAttached) {
			document.addEventListener('visibilitychange', handleVisibilityChange);
			visibilityListenerAttached = true;
			console.info('Hero shader: visibilitychange listener attached');
		}

		perfMonitor = new PerformanceMonitor({
			slowThreshold: 100,
			slowLimit: 8,
			onOverload: () => {
				console.warn(
					'Hero shader: Performance overload detected — destroying shader for this session'
				);
				destroyShader();
			},
		});
		perfMonitor.start();

		console.info('Hero shader: Successfully loaded');
	} catch (error) {
		console.error('Hero shader: Failed to initialize', error);
		activeShader = null;
		activeCanvas = null;
		delete canvas.dataset.shaderInitialized;
	}
};

export { initHeroShaders };

import { createShader } from 'shaders/js';
import { PerformanceMonitor } from '../utils';

let activeShader: Awaited<ReturnType<typeof createShader>> | null = null;
let activeCanvas: HTMLCanvasElement | null = null;
let visibilityListenerAttached = false;
let performanceKilled = localStorage.getItem('hero-shader-performance-killed') === 'true';
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
		if (performanceKilled) {
			console.info(
				'Hero shader: Tab refocused, but shader was killed due to poor performance — skipping'
			);
		} else {
			console.info('Hero shader: Tab refocused, re-initializing shader');
			initHeroShaders();
		}
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

const initHeroShaders = async () => {
	const canvas = document.getElementById('hero-shader') as HTMLCanvasElement | null;

	if (!canvas) {
		console.warn('Hero shader: Canvas element not found');

		return;
	}

	canvas.style.width = '1600px';
	canvas.style.height = '100%';

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

	// Performance-killed path: render a few frames then destroy to leave a frozen frame
	if (performanceKilled) {
		console.info('Hero shader: Performance-killed — rendering single frozen frame');

		try {
			const shader = await createShader(canvas, shaderConfig, {
				onReady: () => {
					canvas.classList.add('loaded');

					// Wait a few frames for the GPU to actually paint before destroying
					let framesRemaining = 3;

					const waitFrame = () => {
						framesRemaining--;

						if (framesRemaining <= 0) {
							shader.destroy();
							console.info('Hero shader: Frozen frame rendered');
						} else {
							requestAnimationFrame(waitFrame);
						}
					};

					requestAnimationFrame(waitFrame);
				},
			});
		} catch {
			delete canvas.dataset.shaderInitialized;
		}

		return;
	}

	// Normal path: full shader with performance monitoring
	try {
		console.info('Hero shader: Initializing...');
		activeCanvas = canvas;
		activeShader = await createShader(canvas, shaderConfig, {
			enablePerformanceTracking: true,
			onReady: () => {
				canvas.classList.add('loaded');
			},
		});

		if (!visibilityListenerAttached) {
			document.addEventListener('visibilitychange', handleVisibilityChange);
			visibilityListenerAttached = true;
			console.info('Hero shader: visibilitychange listener attached');
		}

		perfMonitor = new PerformanceMonitor({
			slowThreshold: 50,
			slowLimit: 3,
			onOverload: () => {
				console.warn('Hero shader: Performance overload detected — killing shader permanently');
				performanceKilled = true;
				localStorage.setItem('hero-shader-performance-killed', 'true');
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

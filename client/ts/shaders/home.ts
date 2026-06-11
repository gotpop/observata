import { createShader } from 'shaders/js';

let activeShader: Awaited<ReturnType<typeof createShader>> | null = null;
let activeCanvas: HTMLCanvasElement | null = null;
let observedCanvas: HTMLCanvasElement | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let visibilityListenerAttached = false;
let isTabVisible = true;

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

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
	const entry = entries[0];
	if (!entry || !isTabVisible) return;

	const canvas = observedCanvas;
	const rect = canvas?.getBoundingClientRect();
	const isInView = entry.isIntersecting && !!rect && rect.width > 0 && rect.height > 0;

	if (isInView && !activeShader) {
		console.info('Hero shader: Canvas scrolled into view, initializing');
		initHeroShaders();
	} else if (!isInView && activeShader) {
		console.info('Hero shader: Canvas scrolled out of view, destroying');
		destroyShader();
	}
};

const handleVisibilityChange = () => {
	if (document.hidden) {
		console.info('Hero shader: Tab hidden, destroying shader');
		isTabVisible = false;
		destroyShader();
	} else {
		isTabVisible = true;
		console.info('Hero shader: Tab refocused, re-initializing shader');
		initHeroShaders();
	}
};

const setupObservers = (canvas: HTMLCanvasElement) => {
	observedCanvas = canvas;

	if (intersectionObserver) return;

	intersectionObserver = new IntersectionObserver(handleIntersection, { threshold: 0 });
	intersectionObserver.observe(canvas);
	console.info('Hero shader: IntersectionObserver set up on canvas');

	if (!visibilityListenerAttached) {
		document.addEventListener('visibilitychange', handleVisibilityChange);
		visibilityListenerAttached = true;
		console.info('Hero shader: visibilitychange listener attached');
	}
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

	try {
		console.info('Hero shader: Initializing...');
		activeCanvas = canvas;
		activeShader = await createShader(
			canvas,
			{
				components: [
					{
						id: 'idmq9s057lzsskesdtt',
						type: 'SolidColor',
						props: {
							color: '#f3edf7',
							blendMode: 'normal',
							maskType: 'alpha',
							opacity: 1,
							transform: {
								offsetX: 0,
								offsetY: 0,
								rotation: 0,
								scale: 1,
								anchorX: 0.5,
								anchorY: 0.5,
								edges: 'transparent',
							},
						},
					},
					{
						type: 'Form3D',
						id: 'idmmr8zyxrodm90feqn',
						props: {
							center: {
								x: 0.63,
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

		setupObservers(canvas);

		console.info('Hero shader: Successfully loaded');
	} catch (error) {
		console.error('Hero shader: Failed to initialize', error);
		activeShader = null;
		activeCanvas = null;
		delete canvas.dataset.shaderInitialized;
	}
};

export { initHeroShaders };

import { COLOUR_BLUE, COLOUR_BLUE_LIGHT, COLOUR_PINK, type ShaderColors } from './colours';

import { createShader } from 'shaders/js';

let activeShader: Awaited<ReturnType<typeof createShader>> | null = null;
let activeCanvas: HTMLCanvasElement | null = null;
let observedCanvas: HTMLCanvasElement | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let visibilityListenerAttached = false;
let isTabVisible = true;

const destroyShader = () => {
	if (activeShader) {
		console.info('Subpage shader: Destroying shader');
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
		console.info('Subpage shader: Canvas scrolled into view, initializing');
		initSubpageShaders();
	} else if (!isInView && activeShader) {
		console.info('Subpage shader: Canvas scrolled out of view, destroying');
		destroyShader();
	}
};

const handleVisibilityChange = () => {
	if (document.hidden) {
		console.info('Subpage shader: Tab hidden, destroying shader');
		isTabVisible = false;
		destroyShader();
	} else {
		isTabVisible = true;
		console.info('Subpage shader: Tab refocused, re-initializing shader');
		initSubpageShaders();
	}
};

const setupObservers = (canvas: HTMLCanvasElement) => {
	observedCanvas = canvas;

	if (intersectionObserver) return;

	intersectionObserver = new IntersectionObserver(handleIntersection, { threshold: 0 });
	intersectionObserver.observe(canvas);
	console.info('Subpage shader: IntersectionObserver set up on canvas');

	if (!visibilityListenerAttached) {
		document.addEventListener('visibilitychange', handleVisibilityChange);
		visibilityListenerAttached = true;
		console.info('Subpage shader: visibilitychange listener attached');
	}
};

function getSubpageShaderConfig({ colorA, colorB }: ShaderColors) {
	return {
		components: [
			{
				type: 'Form3D',
				id: 'idmmr8zyxrodm90feqn',
				props: {
					center: {
						x: 0.332,
						y: 0.75,
					},
					glossiness: 200,
					lighting: 197,
					shape3d: {
						type: 'ribbon',
						angle: 138,
						twist: 24,
						width: 73,
						thickness: 20,
						seed: 21.2,
					},
					shape3dType: 'ribbon',
					speed: 0,
					zoom: 56,
				},
				children: [
					{
						type: 'Swirl',
						id: 'idmmr8zwtuhz62buy44',
						props: {
							colorA,
							colorB,
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
							density: 13,
							opacity: 0.47,
							speed: 0.1,
							strokeWidth: 0.16,
							trailLength: 0.72,
							transform: {
								scale: 0.79,
								offsetX: -0.16,
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
}

const initSubpageShaders = async () => {
	const canvas = document.querySelector('.subpage-shader') as HTMLCanvasElement | null;

	if (!canvas) {
		console.warn('Subpage shader: Canvas element not found');

		return;
	}

	canvas.style.width = '1540px';
	canvas.style.height = '1000px';

	if (!window.isSecureContext || !('gpu' in navigator)) {
		console.warn(
			'Subpage shader: Shaders need HTTPS or localhost with WebGPU support. Current origin:',
			window.location.origin
		);

		return;
	}

	if (canvas.dataset.shaderInitialized === 'true') {
		console.info('Subpage shader: Already initialized, skipping');

		return;
	}

	canvas.dataset.shaderInitialized = 'true';

	const colourMap: Record<string, ShaderColors> = {
		'shader-pink': COLOUR_PINK,
		'shader-blueLight': COLOUR_BLUE_LIGHT,
		'shader-blue': COLOUR_BLUE,
	};

	const colours = colourMap[canvas.id] ?? COLOUR_BLUE;

	const config = getSubpageShaderConfig(colours);

	try {
		console.info('Subpage shader: Initializing...');
		activeCanvas = canvas;
		activeShader = await createShader(canvas, config, {
			onReady: () => {
				canvas.classList.add('loaded');
			},
		});

		setupObservers(canvas);

		console.info('Subpage shader: Successfully loaded');
	} catch (error) {
		console.error('Subpage shader: Failed to initialize', error);
		activeShader = null;
		activeCanvas = null;
		delete canvas.dataset.shaderInitialized;
		intersectionObserver?.disconnect();
		intersectionObserver = null;
	}
};

export { initSubpageShaders };

import { createShader } from 'shaders/js';
import { COLOUR_BLUE, COLOUR_BLUE_LIGHT, COLOUR_PINK, type ShaderColors } from './colours';
import { prepareCanvas } from './utils-shader/warnings';

function getSubpageShaderConfig({ colorA, colorB }: ShaderColors) {
	return {
		components: [
			{
				type: 'Form3D',
				id: 'idmmr8zyxrodm90feqn',
				props: {
					center: {
						x: 0.5,
						y: 0.515,
					},
					glossiness: 200,
					lighting: 197,
					shape3d: {
						type: 'ribbon',
						angle: 138,
						twist: 45,
						width: 39,
						thickness: 8,
						seed: 33,
					},
					shape3dType: 'ribbon',
					speed: 0,
					uvMode: 'mirror',
					zoom: 95,
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
							visible: true,
						},
					},
					{
						type: 'FallingLines',
						id: 'idmq9cbx8wqhsm96pxv',
						props: {
							angle: 180,
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
}

const initSubpageShaders = async () => {
	const canvas = prepareCanvas('.subpage-shader');

	if (!canvas) return;

	canvas.dataset.shaderInitialized = 'true';

	const colourMap: Record<string, ShaderColors> = {
		'shader-pink': COLOUR_PINK,
		'shader-blueLight': COLOUR_BLUE_LIGHT,
		'shader-blue': COLOUR_BLUE,
	};

	const colours = colourMap[canvas.id] ?? COLOUR_BLUE;

	const config = getSubpageShaderConfig(colours);

	try {
		await createShader(canvas, config, {
			onReady: () => {
				canvas.style.width = '';
				canvas.style.height = '';
				canvas.classList.add('loaded');
			},
		});
	} catch (error) {
		console.error('Subpage shader: Failed to initialize', error);

		delete canvas.dataset.shaderInitialized;
	}
};

export { initSubpageShaders };

import { createShader } from 'shaders/js';

import {
	COLOUR_BLUE,
	COLOUR_BLUE_LIGHT,
	COLOUR_BLUE_LIGHTEST,
	COLOUR_PINK,
	type ShaderColors,
} from './colours';

function getCardGeoShaderConfig({ colorA, colorB }: ShaderColors) {
	return {
		components: [
			{
				type: 'Form3D',
				id: 'idmmr8zyxrodm90feqn',
				props: {
					center: {
						x: 1,
						y: 0.45,
					},
					glossiness: 200,
					lighting: 197,
					shape3d: {
						type: 'ribbon',
						angle: -70,
						twist: 24,
						width: 73,
						thickness: 20,
						seed: 25,
					},
					shape3dType: 'ribbon',
					speed: 0,
					transform: {
						anchorX: 0.7,
					},
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
						id: 'idmmr93vzo731cyb4y3',
						props: {
							angle: 0,
							blendMode: 'linearDodge',
							colorB: '#000000',
							opacity: 0.47,
							speed: 0.1,
							strokeWidth: 0.16,
							trailLength: 0.72,
							transform: {
								scale: 0.79,
								offsetX: 0.21,
							},
						},
					},
				],
			},
		],
	};
}

const safe = <T>(promise: Promise<T>): Promise<[Error, null] | [null, T]> =>
	promise.then((data) => [null, data] as [null, T]).catch((err) => [err, null] as [Error, null]);

export async function initCardGeoShader(canvas: HTMLCanvasElement) {
	canvas.style.width = '82px';
	canvas.style.height = '220px';

	const colourMap: Record<string, ShaderColors> = {
		'shader-pink': COLOUR_PINK,
		'shader-blueLight': COLOUR_BLUE_LIGHT,
		'shader-blueLightest': COLOUR_BLUE_LIGHTEST,
		'shader-blue': COLOUR_BLUE,
	};

	const colours = colourMap[canvas.id] ?? COLOUR_BLUE;

	const config = getCardGeoShaderConfig(colours);

	const [error] = await safe(
		createShader(canvas, config, {
			onReady: () => {
				canvas.classList.add('loaded');
			},
		})
	);

	if (error) {
		console.error(`Card geo shader: Failed to initialize on canvas #${canvas.id}`, error);

		throw error;
	}
}

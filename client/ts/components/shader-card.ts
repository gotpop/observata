import { createShader } from 'shaders/js';

import {
	COLOUR_BLUE,
	COLOUR_BLUE_LIGHT,
	COLOUR_BLUE_LIGHTEST,
	COLOUR_PINK,
	type ShaderColors,
} from '../shaders/colours';
import { deferUntilIdle } from '../utils';

const COLOUR_MAP: Record<string, ShaderColors> = {
	blue: COLOUR_BLUE,
	blueLight: COLOUR_BLUE_LIGHT,
	blueLightest: COLOUR_BLUE_LIGHTEST,
	pink: COLOUR_PINK,
};

const BUFFER_WIDTH = 82;
const BUFFER_HEIGHT = 230;

function buildConfig({ colorA, colorB }: ShaderColors) {
	return {
		components: [
			{
				type: 'Form3D',
				id: 'idmmr8zyxrodm90feqn',
				props: {
					center: { x: 1.8, y: 0 },
					glossiness: 200,
					lighting: 197,
					shape3d: {
						type: 'ribbon',
						angle: 113.5,
						twist: 26,
						width: 62,
						thickness: 76,
						seed: 25,
					},
					shape3dType: 'ribbon',
					speed: 0,

					zoom: 105,
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
							transform: { scale: 0.79, offsetX: 0.21 },
						},
					},
				],
			},
			{
				type: 'FilmGrain',
				id: 'idmmr97z6pijyaz1v1u',
				props: {
					opacity: 0.32,
					strength: {
						type: 'map',
						source: '',
						channel: 'alpha',
						inputMax: 1,
						inputMin: 0,
						outputMax: 1,
						outputMin: 0,
					},
					visible: true,
				},
			},
		],
	};
}

const template = document.createElement('template');
template.innerHTML = `
	<style>
		:host { display: block; }
		canvas { display: none; height: 230px; width: 82px; }
		:host([loaded]) canvas { display: block; }
		img { display: block; height: 230px; width: 82px; }
		:host([loaded]) img { display: none; }
	</style>
	<canvas part="canvas" width="${BUFFER_WIDTH}" height="${BUFFER_HEIGHT}" aria-hidden="true"></canvas>
	<img part="fallback" alt="" aria-hidden="true" loading="lazy" />
`;

/**
 * `<shader-card>` — self-initialising WebGPU shader card.
 *
 * Attributes:
 *   - `colour`   one of blue | blueLight | blueLightest | pink (default: blue)
 *   - `fallback` URL of the image shown when WebGPU is unavailable
 */
class ShaderCard extends HTMLElement {
	private canvas: HTMLCanvasElement | null = null;

	private shader: Awaited<ReturnType<typeof createShader>> | null = null;

	private started = false;

	public static get observedAttributes(): string[] {
		return ['colour', 'fallback'];
	}

	public constructor() {
		super();
		this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
	}

	public connectedCallback(): void {
		if (this.started || !this.isConnected) {
			return;
		}

		this.started = true;
		this.canvas = this.shadowRoot?.querySelector('canvas') ?? null;

		const img = this.shadowRoot?.querySelector('img') ?? null;

		if (img) {
			img.src = this.getAttribute('fallback') ?? '';
		}

		// Defer so the hero shader keeps GPU priority on first paint.
		deferUntilIdle(() => void this.init());
	}

	public attributeChangedCallback(name: string, _old: string, value: string): void {
		if (!this.started) {
			return;
		}
		if (name === 'fallback') {
			const img = this.shadowRoot?.querySelector('img') ?? null;
			if (img) {
				img.src = value;
			}
		}
		if (name === 'colour') {
			void this.rebuild();
		}
	}

	public disconnectedCallback(): void {
		this.destroy();
	}

	private async init(): Promise<void> {
		if (!this.canvas) {
			return;
		}

		// No WebGPU / insecure context — leave the fallback image visible.
		if (!window.isSecureContext || !('gpu' in navigator)) {
			return;
		}

		const colours = COLOUR_MAP[this.getAttribute('colour') ?? 'blue'] ?? COLOUR_BLUE;

		try {
			this.shader = await createShader(this.canvas, buildConfig(colours), {
				onReady: () => this.setAttribute('loaded', ''),
			});
		} catch (error) {
			console.error('<shader-card>: shader init failed', error);
		}
	}

	private async rebuild(): Promise<void> {
		this.destroy();
		this.removeAttribute('loaded');
		await this.init();
	}

	private destroy(): void {
		this.shader?.destroy();
		this.shader = null;
	}
}

if (!customElements.get('shader-card')) {
	customElements.define('shader-card', ShaderCard);
}

export { ShaderCard };

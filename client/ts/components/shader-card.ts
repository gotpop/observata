import { createShader } from 'shaders/js';

import { COLOUR_BLUE, COLOUR_BLUE_LIGHTEST, type ShaderColors } from '../shaders/colours';
import { deferUntilIdle } from '../utils';
import { createMatchMedia } from '../utils/breakpoints';

const DESKTOP_PATTERN: ShaderColors[] = [
	COLOUR_BLUE,
	COLOUR_BLUE_LIGHTEST,
	COLOUR_BLUE_LIGHTEST,
	COLOUR_BLUE,
	COLOUR_BLUE,
	COLOUR_BLUE_LIGHTEST,
];

const MOBILE_PATTERN: ShaderColors[] = [COLOUR_BLUE, COLOUR_BLUE_LIGHTEST];

function getShaderIndex(card: ShaderCard): number {
	const container = card.closest('.block-cards, section');

	if (!container) {
		return 0;
	}

	return Array.from(container.querySelectorAll('shader-card')).indexOf(card);
}

function getColoursForCard(card: ShaderCard): ShaderColors {
	const index = getShaderIndex(card);
	const pattern = createMatchMedia('md').matches ? DESKTOP_PATTERN : MOBILE_PATTERN;

	return pattern[index % pattern.length] ?? COLOUR_BLUE;
}

const BUFFER_WIDTH = 92;
const BUFFER_HEIGHT = 250;

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
		canvas { display: none; height: 250px; width: 92px; }
		:host([loaded]) canvas { display: block; }
		img { display: block; height: 250px; width: 92px; }
		:host([loaded]) img { display: none; }
	</style>
	<canvas part="canvas" width="${BUFFER_WIDTH}" height="${BUFFER_HEIGHT}" aria-hidden="true"></canvas>
	<img part="fallback" alt="" aria-hidden="true" loading="lazy" />
`;

/**
 * `<shader-card>` — self-initialising WebGPU shader card.
 *
 * Colours are auto-assigned by position within the nearest grid container
 * and swapped between desktop/mobile patterns on breakpoint change.
 *
 * Attributes:
 *   - `fallback` URL of the image shown when WebGPU is unavailable
 */
class ShaderCard extends HTMLElement {
	private canvas: HTMLCanvasElement | null = null;

	private shader: Awaited<ReturnType<typeof createShader>> | null = null;

	private started = false;

	private readonly mediaQuery: MediaQueryList = createMatchMedia('md');

	private readonly handleBreakpointChange = (): void => {
		void this.rebuild();
	};

	public static get observedAttributes(): string[] {
		return ['fallback'];
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

		this.mediaQuery.addEventListener('change', this.handleBreakpointChange);

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
	}

	public disconnectedCallback(): void {
		this.mediaQuery.removeEventListener('change', this.handleBreakpointChange);
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

		const colours = getColoursForCard(this);

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

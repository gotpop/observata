import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import GraphicSelect from '../components/graphic-select';

const SVG_BASE = '/wp-content/themes/observata/assets/svg';

const BACKGROUND_GRAPHICS = [
	{
		label: 'Sphere Globe Tilted',
		value: 'graphics/spheres/sphere-globe-tilted',
		icon: `${SVG_BASE}/spheres/sphere-globe-tilted.svg`,
	},
	{
		label: 'Sphere Globe 45',
		value: 'graphics/spheres/sphere-globe-45',
		icon: `${SVG_BASE}/spheres/sphere-globe-45.svg`,
	},
	{
		label: 'Sphere Pie',
		value: 'graphics/spheres/sphere-pie',
		icon: `${SVG_BASE}/spheres/sphere-pie.svg`,
	},
	{
		label: 'Sphere Amorphous',
		value: 'graphics/spheres/sphere-amorphous',
		icon: `${SVG_BASE}/spheres/sphere-amorphous.svg`,
	},
	{
		label: 'Sphere Atom',
		value: 'graphics/spheres/sphere-atom',
		icon: `${SVG_BASE}/spheres/sphere-atom.svg`,
	},
	{
		label: 'Sphere Blob',
		value: 'graphics/spheres/sphere-blob',
		icon: `${SVG_BASE}/spheres/sphere-blob.svg`,
	},
	{
		label: 'Sphere Bulge',
		value: 'graphics/spheres/sphere-bulge',
		icon: `${SVG_BASE}/spheres/sphere-bulge.svg`,
	},
	{
		label: 'Sphere Dots Connected',
		value: 'graphics/spheres/sphere-dots-connected',
		icon: `${SVG_BASE}/spheres/sphere-dots-connected.svg`,
	},
	{
		label: 'Sphere Football',
		value: 'graphics/spheres/sphere-football',
		icon: `${SVG_BASE}/spheres/sphere-football.svg`,
	},
	{
		label: 'Sphere Geodesic',
		value: 'graphics/spheres/sphere-geodesic',
		icon: `${SVG_BASE}/spheres/sphere-geodesic.svg`,
	},
	{
		label: 'Sphere Lattice',
		value: 'graphics/spheres/sphere-lattice',
		icon: `${SVG_BASE}/spheres/sphere-lattice.svg`,
	},
	{ label: 'Europe', value: 'graphics/tech/europe-graphic' },
];

const CARD_TEXT_SIMPLE_TEMPLATE = [['observata/card-text-simple', { heading: 'Card Heading' }]];

export default function SectionGraphicCardEdit({ attributes, setAttributes }) {
	const { sectionBgColour, layout } = attributes;
	const blockProps = useBlockProps({
		className: 'observata-section-graphic-card-editor',
	});

	return (
		<div {...blockProps}>
			<BlockLabel name="Section Graphic Card">
				<SelectControl
					label={__('Section Background', 'observata')}
					value={sectionBgColour}
					options={[
						{ label: __('White', 'observata'), value: 'white' },
						{ label: __('Grey', 'observata'), value: 'grey' },
						{ label: __('Gradient', 'observata'), value: 'gradient' },
					]}
					onChange={(value) => setAttributes({ sectionBgColour: value })}
				/>
				<GraphicSelect
					label={__('Background Graphic', 'observata')}
					value={attributes.graphicSphere}
					options={BACKGROUND_GRAPHICS}
					onChange={(value) => setAttributes({ graphicSphere: value })}
				/>
				<SelectControl
					label={__('Layout', 'observata')}
					value={layout}
					options={[
						{ label: __('Content', 'observata'), value: 'content' },
						{ label: __('Inner', 'observata'), value: 'inner' },
					]}
					onChange={(value) => setAttributes({ layout: value })}
				/>
			</BlockLabel>

			<div className="card-container">
				<InnerBlocks
					template={CARD_TEXT_SIMPLE_TEMPLATE}
					allowedBlocks={['observata/card-text-simple']}
				/>
			</div>
		</div>
	);
}

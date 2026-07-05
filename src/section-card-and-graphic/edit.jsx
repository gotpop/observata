import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import GraphicSelect from '../components/graphic-select';

const SVG_BASE = '/wp-content/themes/observata/assets/svg';

const SPHERE_GRAPHICS = [
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
];

const CARD_TEMPLATE = [
	[
		'observata/card-geo-list',
		{
			cardTitle: 'Unified Data Ingestion',
			listItem1: 'Centralise all your observability data into one platform',
			listItem2: 'Unify logs, metrics, and traces across your entire stack',
			iconGeo: '01',
		},
	],
];

export default function SectionCardAndGraphicEdit({ attributes, setAttributes }) {
	const { graphicSphere, graphicPosition, sectionBgColour } = attributes;
	const blockProps = useBlockProps({
		className: `block-section-card-and-graphic position-${graphicPosition}`,
	});

	return (
		<section {...blockProps}>
			<BlockLabel name="Section Card & Graphic">
				<SelectControl
					label={__('Section Background', 'observata')}
					value={sectionBgColour}
					options={[
						{ label: __('White', 'observata'), value: 'white' },
						{ label: __('Grey', 'observata'), value: 'grey' },
						{ label: __('Gradient', 'observata'), value: 'gradient' },
					]}
					onChange={(val) => setAttributes({ sectionBgColour: val })}
				/>
				<GraphicSelect
					label={__('Sphere Graphic', 'observata')}
					value={graphicSphere}
					options={SPHERE_GRAPHICS}
					onChange={(val) => setAttributes({ graphicSphere: val })}
				/>
				<SelectControl
					label={__('Graphic Position', 'observata')}
					value={graphicPosition}
					options={[
						{ label: 'Left', value: 'left' },
						{ label: 'Right', value: 'right' },
					]}
					onChange={(val) => setAttributes({ graphicPosition: val })}
				/>
			</BlockLabel>

			<div className="block-content">
				<div className="section-card-and-graphic__inner">
					<div className="section-card-and-graphic__body">
						<InnerBlocks
							template={CARD_TEMPLATE}
							templateLock={false}
							allowedBlocks={['observata/card-geo-list']}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

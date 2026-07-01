import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const BACKGROUND_GRAPHICS = [
	{ label: 'Sphere 01', value: 'graphics/spheres/sphere-01' },
	{ label: 'Sphere 01b', value: 'graphics/spheres/sphere-01b' },
	{ label: 'Sphere 09', value: 'graphics/spheres/sphere-09' },
	{ label: 'Sphere 18', value: 'graphics/spheres/sphere-18' },
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
				<SelectControl
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

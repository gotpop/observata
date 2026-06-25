import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const GRAPHIC_OPTIONS = [
	{ label: '1', value: '1' },
	{ label: '2', value: '2' },
	{ label: '3', value: '3' },
	{ label: '4', value: '4' },
	{ label: '5', value: '5' },
	{ label: '6', value: '6' },
	{ label: '7', value: '7' },
	{ label: '8', value: '8' },
	{ label: '9', value: '9' },
	{ label: '10', value: '10' },
	{ label: '11', value: '11' },
	{ label: '12', value: '12' },
	{ label: '13', value: '13' },
	{ label: '14', value: '14' },
	{ label: '15', value: '15' },
	{ label: '16', value: '16' },
	{ label: '17', value: '17' },
	{ label: '18', value: '18' },
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
	const { graphic, graphicPosition, sectionBgColour } = attributes;
	const blockProps = useBlockProps({
		className: `block-section-card-and-graphic graphic-${graphicPosition}`,
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
				<SelectControl
					label={__('Graphic', 'observata')}
					value={graphic}
					options={GRAPHIC_OPTIONS}
					onChange={(val) => setAttributes({ graphic: val })}
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

import './editor.css';

import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import ControlsLayout from '../components/controls-layout';
import SectionIntro from '../components/section-intro';

const CARD_TEMPLATE = [
	[
		'observata/card-micro',
		{
			cardTitle: 'Alert fatigue',
			cardDescription: 'Too many noisy alerts hide the incidents that matter most.',
		},
	],
	[
		'observata/card-micro',
		{
			cardTitle: 'Cost sprawl',
			cardDescription: 'Unmanaged ingestion and retention policies inflate platform spend.',
		},
	],
	[
		'observata/card-micro',
		{
			cardTitle: 'Blind spots',
			cardDescription: 'Disconnected logs, metrics, and traces prevent fast root-cause analysis.',
		},
	],
];

export default function Edit({ attributes, setAttributes }) {
	const { sectionBgColour, cardTitle, cardBody } = attributes;
	const blockProps = useBlockProps({ className: 'observability-observability-editor' });

	return (
		<div {...blockProps}>
			<BlockLabel name="Observability">
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
			</BlockLabel>
			<SectionIntro attributes={attributes} setAttributes={setAttributes} />

			<article className="card-large">
				<ControlsLayout columns={3} gap="1rem">
					<InnerBlocks
						template={CARD_TEMPLATE}
						templateLock="all"
						allowedBlocks={['observata/card-micro']}
					/>
				</ControlsLayout>
				<div className="card-large-editor">
					<RichText
						tagName="h4"
						className="heading-md"
						value={cardTitle}
						onChange={(val) => setAttributes({ cardTitle: val })}
						placeholder={__('Card title…', 'observata')}
						disableLineBreaks
						allowedFormats={[]}
					/>
					<RichText
						tagName="p"
						className="body-md"
						value={cardBody}
						onChange={(val) => setAttributes({ cardBody: val })}
						placeholder={__('Card body…', 'observata')}
						disableLineBreaks
						allowedFormats={[]}
					/>
				</div>
			</article>
		</div>
	);
}

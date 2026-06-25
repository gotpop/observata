import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import ControlsLayout from '../components/controls-layout';
import SectionIntro from '../components/section-intro';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const CARD_TEMPLATE = [
	[
		'observata/card-micro',
		{
			cardTitle: 'Log analytics',
			cardDescription:
				'Real-time log ingestion, parsing, and correlation across your entire infrastructure.',
		},
	],
	[
		'observata/card-micro',
		{
			cardTitle: 'Infrastructure monitoring',
			cardDescription:
				'Track host, container, and orchestration metrics with intelligent alerting and dashboards.',
		},
	],
	[
		'observata/card-micro',
		{
			cardTitle: 'APM & tracing',
			cardDescription:
				'Distributed tracing and application performance monitoring with OpenTelemetry native support.',
		},
	],
	[
		'observata/card-micro',
		{
			cardTitle: 'Security analytics',
			cardDescription:
				'Detect threats and anomalies with SIEM-powered security analytics and automated response.',
		},
	],
	[
		'observata/card-micro',
		{
			cardTitle: 'Cloud cost optimisation',
			cardDescription:
				'Identify waste and right-size resources across your cloud deployments with actionable recommendations.',
		},
	],
	[
		'observata/card-micro',
		{
			cardTitle: 'Custom integrations',
			cardDescription:
				'Connect any data source with our flexible API and extensive library of pre-built connectors.',
		},
	],
];

export default function GridCardsMicroEdit({ attributes, setAttributes }) {
	const { sectionBgColour } = attributes;
	const blockProps = useBlockProps({ className: 'observata-grid-cards-micro-editor' });

	return (
		<div {...blockProps}>
			<BlockLabel name="Grid Cards Micro">
				<SelectControl
					label={__('Section Background', 'observata')}
					value={sectionBgColour}
					options={[
						{ label: __('White', 'observata'), value: 'white' },
						{ label: __('Grey', 'observata'), value: 'grey' },
					]}
					onChange={(val) => setAttributes({ sectionBgColour: val })}
				/>
			</BlockLabel>
			<SectionIntro attributes={attributes} setAttributes={setAttributes} />
			<ControlsLayout columns={3} gap="1rem">
				<InnerBlocks
					template={CARD_TEMPLATE}
					allowedBlocks={['observata/card-micro']}
					templateLock={false}
				/>
			</ControlsLayout>
		</div>
	);
}

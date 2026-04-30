import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { TextControl } from '@wordpress/components';

const CARD_MICRO_TEMPLATE = [
    ['observata/card-micro', { cardTitle: 'Log analytics', cardDescription: 'Real-time log ingestion, parsing, and correlation across your entire infrastructure.' }],
    ['observata/card-micro', { cardTitle: 'Infrastructure monitoring', cardDescription: 'Track host, container, and orchestration metrics with intelligent alerting and dashboards.' }],
    ['observata/card-micro', { cardTitle: 'APM & tracing', cardDescription: 'Distributed tracing and application performance monitoring with OpenTelemetry native support.' }],
    ['observata/card-micro', { cardTitle: 'Security analytics', cardDescription: 'Detect threats and anomalies with SIEM-powered security analytics and automated response.' }],
    ['observata/card-micro', { cardTitle: 'Cloud cost optimisation', cardDescription: 'Identify waste and right-size resources across your cloud deployments with actionable recommendations.' }],
    ['observata/card-micro', { cardTitle: 'Custom integrations', cardDescription: 'Connect any data source with our flexible API and extensive library of pre-built connectors.' }],
    ['observata/card-micro', { cardTitle: 'Data pipeline management', cardDescription: 'Design, monitor, and troubleshoot complex data pipelines with visual flow management tools.' }],
    ['observata/card-micro', { cardTitle: 'Compliance reporting', cardDescription: 'Automated compliance checks and audit-ready reporting for SOC 2, GDPR, and HIPAA frameworks.' }],
];

export default function CardsGridMicroEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-cards-grid-micro-editor' });

    return (
        <div {...blockProps}>
            <div className="observata-controls">
                <TextControl
                    label="Section Title"
                    value={attributes.sectionTitle}
                    onChange={(value) => setAttributes({ sectionTitle: value })}
                />
                <TextControl
                    label="Intro Text"
                    value={attributes.introText}
                    onChange={(value) => setAttributes({ introText: value })}
                />
            </div>

            <div className="cards-container">
                <InnerBlocks
                    template={CARD_MICRO_TEMPLATE}
                    templateLock="insert"
                    allowedBlocks={['observata/card-micro']}
                />
            </div>
        </div>
    );
}
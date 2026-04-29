import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { TextControl } from '@wordpress/components';

const CARD_TEMPLATE = [
    ['observata/card-swoosh-icon', { cardTitle: 'Unify every data source', cardText: 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.', iconNumber: '01' }],
    ['observata/card-swoosh-icon', { cardTitle: 'Zero cost migration', cardText: 'Transition from legacy tools without migration headache. As Elastic specialists, we manage your end-to-end move for free—ensuring a seamless shift to a faster, more flexible observability standard.', iconNumber: '02' }],
    ['observata/card-swoosh-icon', { cardTitle: 'Unlimited optimisation', cardText: 'Transform static charts into actionable dashboards using ML and AI. Our team provides ongoing tuning and predictive analytics, delivering true operational resilience without the risk of vendor lock-in.', iconNumber: '03' }],
    ['observata/card-swoosh-icon', { cardTitle: 'Simplified licencing', cardText: 'Eliminate complex billing with one flat monthly fee. Our all-inclusive model covers ingestion, licensing, and operational support. Ensuring you never face surprise charges or "data taxes" from third-party vendors.', iconNumber: '04' }],
    ['observata/card-swoosh-icon', { cardTitle: 'Support & training', cardText: 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.', iconNumber: '05' }],
    ['observata/card-swoosh-icon', { cardTitle: 'Unify every data source', cardText: 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.', iconNumber: '06' }],
];

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-cards-grid-editor' });

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
                    template={CARD_TEMPLATE}
                    templateLock="all"
                    allowedBlocks={['observata/card-swoosh-icon']}
                />
            </div>
        </div>
    );
}
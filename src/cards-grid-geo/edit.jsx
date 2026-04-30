import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { TextControl } from '@wordpress/components';

const CARD_GEO_TEMPLATE = [
    ['observata/card-geo', { cardTitle: 'Unified Data Ingestion', cardText: 'Centralise all your observability data into one platform. We unify logs, metrics, and traces across your entire stack using open standards.', iconGeo: '01' }],
    ['observata/card-geo', { cardTitle: 'Zero cost elastic migration', cardText: 'Transition from legacy tools without migration costs. As Elastic specialists, we manage your end-to-end move for free.', iconGeo: '02' }],
    ['observata/card-geo', { cardTitle: 'Real-time analytics', cardText: 'Transform static charts into actionable dashboards using ML and AI. Our team delivers ongoing tuning and predictive analytics.', iconGeo: '03' }],
    ['observata/card-geo', { cardTitle: 'Simplified licensing', cardText: 'Eliminate complex billing with one flat monthly fee. Our all-inclusive model covers ingestion, licensing, and operational support.', iconGeo: '04' }],
    ['observata/card-geo', { cardTitle: 'Embedded experts', cardText: 'We embed directly into your environment to tune pipelines and triage alerts, eliminating skill gaps with 24/7 lifecycle coverage.', iconGeo: '05' }],
    ['observata/card-geo', { cardTitle: 'Achieve higher ROI', cardText: 'Maximise your investment with optimised data pipelines and reduced operational overhead. Realise measurable cost savings.', iconGeo: '06' }],
];

export default function CardsGridGeoEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-cards-grid-geo-editor' });

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
                    template={CARD_GEO_TEMPLATE}
                    templateLock="insert"
                    allowedBlocks={['observata/card-geo']}
                />
            </div>
        </div>
    );
}
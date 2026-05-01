import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { TextControl } from '@wordpress/components';

const CARD_TEMPLATE = [
    ['observata/card-geo-shader', { cardTitle: 'Unify every data source', cardText: 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.', iconNumber: '01' }],
    ['observata/card-geo-shader', { cardTitle: 'Zero cost migration', cardText: 'Transition from legacy tools without migration headache. As Elastic specialists, we manage your end-to-end move for free—ensuring a seamless shift to a faster, more flexible observability standard.', iconNumber: '02' }],
    ['observata/card-geo-shader', { cardTitle: 'Unlimited optimisation', cardText: 'Transform static charts into actionable dashboards using ML and AI. Our team provides ongoing tuning and predictive analytics, delivering true operational resilience without the risk of vendor lock-in.', iconNumber: '03' }],
    ['observata/card-geo-shader', { cardTitle: 'Simplified licencing', cardText: 'Eliminate complex billing with one flat monthly fee. Our all-inclusive model covers ingestion, licensing, and operational support. Ensuring you never face surprise charges or "data taxes" from third-party vendors.', iconNumber: '04' }],
    ['observata/card-geo-shader', { cardTitle: 'Support & training', cardText: 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.', iconNumber: '05' }],
    ['observata/card-geo-shader', { cardTitle: 'Unify every data source', cardText: 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.', iconNumber: '06' }],
];

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-grid-cards-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards">
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
            </BlockLabel>

            <div className="cards-container">
                <InnerBlocks
                    template={CARD_TEMPLATE}
                    templateLock="all"
                    allowedBlocks={['observata/card-geo-shader']}
                />
            </div>
        </div>
    );
}
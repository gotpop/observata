import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import SectionIntro from '../components/section-intro';

const CARD_TEMPLATE = [
    ['observata/card-geo-shader', { cardTitle: 'Unify every data source', cardText: 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.', iconGeo: '01' }],
    ['observata/card-geo-shader', { cardTitle: 'Zero cost migration', cardText: 'Transition from legacy tools without migration headache. As Elastic specialists, we manage your end-to-end move for free—ensuring a seamless shift to a faster, more flexible observability standard.', iconGeo: '02' }],
    ['observata/card-geo-shader', { cardTitle: 'Unlimited optimisation', cardText: 'Transform static charts into actionable dashboards using ML and AI. Our team provides ongoing tuning and predictive analytics, delivering true operational resilience without the risk of vendor lock-in.', iconGeo: '03' }],
    ['observata/card-geo-shader', { cardTitle: 'Simplified licencing', cardText: 'Eliminate complex billing with one flat monthly fee. Our all-inclusive model covers ingestion, licensing, and operational support. Ensuring you never face surprise charges or "data taxes" from third-party vendors.', iconGeo: '04' }],
    ['observata/card-geo-shader', { cardTitle: 'Support & training', cardText: 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.', iconGeo: '05' }],
    ['observata/card-geo-shader', { cardTitle: 'Unify every data source', cardText: 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.', iconGeo: '06' }],
];

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-grid-cards-shader-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards Shader" />
            <SectionIntro attributes={attributes} setAttributes={setAttributes} />

            <div className="cards-container">
                <InnerBlocks
                    template={CARD_TEMPLATE}
                    templateLock={false}
                    allowedBlocks={['observata/card-geo-shader']}
                />
            </div>
        </div>
    );
}
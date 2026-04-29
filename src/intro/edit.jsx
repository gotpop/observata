import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';


const CARD_GEO_TEMPLATE = [
    ['observata/card-geo', { cardTitle: 'Embedded experts', cardText: 'We embed directly into your environment to tune pipelines and triage alerts. Eliminate skill gaps and lower overhead with 24/7 lifecycle coverage and executive-level reporting.', iconGeo: '24' }],
    ['observata/card-geo', { cardTitle: 'One fee — Zero surprises', cardText: 'We own the license; you pay one flat monthly bill for data usage. This includes unlimited support, optimization, and knowledge transfer to ensure total operational stability.', iconGeo: '28' }],
    ['observata/card-geo', { cardTitle: 'Achieve higher ROI', cardText: 'We embed directly into your environment to tune pipelines and triage alerts. Eliminate skill gaps and lower overhead with 24/7 lifecycle coverage and executive-level reporting.', iconGeo: '26' }],
];

export default function IntroEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({
        className: 'block-intro',
    });

    return (
        <section {...blockProps}>
            <div className="logo-strip is-placeholder">
                <div className="logo-item"><span>AF</span></div>
                <div className="logo-item"><span>Tele2</span></div>
                <div className="logo-item"><span>Elastic</span></div>
                <div className="logo-item"><span>CrowdStrike</span></div>
            </div>

            <div className="block-content">
                <InnerBlocks
                    allowedBlocks={['observata/card-geo']}
                    template={CARD_GEO_TEMPLATE}
                    templateLock="insert"
                />
            </div>
        </section>
    );
}
import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const CARD_GEO_TEMPLATE = [
    ['observata/card-geo', { cardTitle: 'Embedded experts', cardText: 'We embed directly into your environment to tune pipelines and triage alerts. Eliminate skill gaps and lower overhead with 24/7 lifecycle coverage and executive-level reporting.', iconGeo: '24' }],
    ['observata/card-geo', { cardTitle: 'One fee — Zero surprises', cardText: 'We own the license; you pay one flat monthly bill for data usage. This includes unlimited support, optimization, and knowledge transfer to ensure total operational stability.', iconGeo: '28' }],
    ['observata/card-geo', { cardTitle: 'Achieve higher ROI', cardText: 'We embed directly into your environment to tune pipelines and triage alerts. Eliminate skill gaps and lower overhead with 24/7 lifecycle coverage and executive-level reporting.', iconGeo: '26' }],
];

export default function SectionIntroHomeEdit({ attributes, setAttributes }) {
    const { sectionBgColour } = attributes;
    const blockProps = useBlockProps({
        className: 'block-section-intro-home',
    });

    return (
        <section {...blockProps}>
            <BlockLabel name="Section Intro Home" />

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
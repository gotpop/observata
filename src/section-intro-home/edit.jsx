import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const CARD_GEO_TEMPLATE = [
    ['observata/card-geo', { cardTitle: 'Consolidated ecosystem', cardText: 'We consolidate your platforms, licensing and experts into a single service. You pay only for data usage; never for hours or headcount. Built-in forecasting handles data spikes for total budget predictability.', iconGeo: '24' }],
    ['observata/card-geo', { cardTitle: 'Expert ownership', cardText: 'You define the outcome; we deliver the result. Our experts embed within your team to unify your data for a clear, company-wide view. We ensure your platform is organised, adopted, and delivering full value every day.', iconGeo: '28' }],
    ['observata/card-geo', { cardTitle: 'Continuous cost optimisation', cardText: 'Stop paying for data you don’t use. We tune your system to filter noise and lower cloud spend. By preventing problems instead of just fixing them, we protect your revenue and drive long-term ROI.', iconGeo: '26' }],
];

export default function IntroEdit({ attributes, setAttributes }) {
    const { sectionBgColour } = attributes;
    const blockProps = useBlockProps({
        className: 'block-intro',
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
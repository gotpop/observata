import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const GRAPHIC_OPTIONS = [
    { label: 'Ribbon Star', value: 'ribbon-star' },
    { label: 'Ribbon Star Mono', value: 'ribbon-star-graphic-mono' },
    { label: 'Ribbon Wave', value: 'ribbon-wave' },
    { label: 'Sine Wave', value: 'sine-wave' },
    { label: 'Sine Flute', value: 'sine-flute' },
    { label: 'Connected Dots', value: 'connected-dots' },
    { label: 'Donut Plane', value: 'donut-plane' },
    { label: 'Globe Dots', value: 'globe-dots' },
    { label: 'Globe Lines', value: 'globe-lines' },
    { label: 'Infinity Twist', value: 'infinity-twist' },
    { label: 'Plane Distortion', value: 'plane-distortion' },
    { label: 'Squares Rotating', value: 'squares-rotating' },
    { label: 'Swooping Lines', value: 'swooping-lines' },
    { label: 'Target', value: 'target' },
    { label: 'Target Plane', value: 'target-plane' },
    { label: 'Waveform', value: 'waveform' },
];

const CARD_TEMPLATE = [
    ['observata/card-geo-list', { cardTitle: 'Unified Data Ingestion', listItem1: 'Centralise all your observability data into one platform', listItem2: 'Unify logs, metrics, and traces across your entire stack', iconGeo: '01' }],
];

export default function SectionCardAndGraphicEdit({ attributes, setAttributes }) {
    const { graphic, graphicPosition } = attributes;
    const blockProps = useBlockProps({
        className: `block-section-card-and-graphic graphic-${graphicPosition}`,
    });

    return (
        <section {...blockProps}>
            <BlockLabel name="Section Card & Graphic">
                <SelectControl
                    label={__('Graphic', 'observata')}
                    value={graphic}
                    options={GRAPHIC_OPTIONS}
                    onChange={(val) => setAttributes({ graphic: val })}
                />
                <SelectControl
                    label={__('Graphic Position', 'observata')}
                    value={graphicPosition}
                    options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                    ]}
                    onChange={(val) => setAttributes({ graphicPosition: val })}
                />
            </BlockLabel>

            <div className="block-content">
                <div className="section-card-and-graphic__inner">
                    <div className="section-card-and-graphic__visual">
                        <img
                            src={`${window.observata?.templateUrl || ''}/assets/svg/graphics/${graphic}-graphic.svg`}
                            alt={`${graphic} graphic`}
                        />
                    </div>
                    <div className="section-card-and-graphic__body">
                        <InnerBlocks
                            template={CARD_TEMPLATE}
                            templateLock={false}
                            allowedBlocks={['observata/card-geo-list']}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
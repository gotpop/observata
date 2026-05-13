import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import BlockLabel from '../components/block-label';

const SCIENCE_GRAPHICS = [
    { label: 'None', value: '' },
    { label: 'Connected Dots', value: 'connected-dots-graphic' },
    { label: 'Europe', value: 'europe-dots-graphic' },
    { label: 'Donut Plane', value: 'donut-plane-graphic' },
    { label: 'Globe Dots', value: 'globe-dots-graphic' },
    { label: 'Globe Lines', value: 'globe-lines-graphic' },
    { label: 'Infinity Twist', value: 'infinity-twist-graphic' },
    { label: 'Plane Distortion', value: 'plane-distortion-graphic' },
    { label: 'Ribbon Star', value: 'ribbon-star-graphic' },
    { label: 'Ribbon Star Mono', value: 'ribbon-star-graphic-mono' },
    { label: 'Ribbon Wave', value: 'ribbon-wave-graphic' },
    { label: 'Sine Flute', value: 'sine-flute-graphic' },
    { label: 'Sine Wave', value: 'sine-wave-graphic' },
    { label: 'Squares Rotating', value: 'squares-rotating-graphic' },
    { label: 'Swooping Lines', value: 'swooping-lines' },
    { label: 'Target', value: 'target-graphic' },
    { label: 'Target Plane', value: 'target-plane-graphic' },
    { label: 'Waveform', value: 'waveform-graphic' },
];

const CARD_TEXT_SIMPLE_TEMPLATE = [
    ['observata/card-text-simple', { heading: 'Card Heading' }],
];

export default function PanelGraphicCardSimpleTextEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-panel-graphic-card-simple-text-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Panel Graphic Card Simple Text">
                <SelectControl
                    label="Background Graphic"
                    value={attributes.backgroundGraphic}
                    options={SCIENCE_GRAPHICS}
                    onChange={(value) => setAttributes({ backgroundGraphic: value })}
                />
            </BlockLabel>

            <div className="card-container">
                <InnerBlocks
                    template={CARD_TEXT_SIMPLE_TEMPLATE}
                    templateLock="insert"
                    allowedBlocks={['observata/card-text-simple']}
                />
            </div>
        </div>
    );
}

import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { SelectControl } from '@wordpress/components';

const SCIENCE_GRAPHICS = [
    { label: 'None', value: '' },
    { label: 'Connected Dots', value: 'connected-dots-graphic' },
    { label: 'Donut Plane', value: 'donut-plane-graphic' },
    { label: 'Globe Dots', value: 'globe-dots-graphic' },
    { label: 'Globe Lines', value: 'globe-lines-graphic' },
    { label: 'Infinity Twist', value: 'infinity-twist-graphic' },
    { label: 'Plane Distortion', value: 'plane-distortion-graphic' },
    { label: 'Ribbon Star', value: 'ribbon-star-graphic' },
    { label: 'Ribbon Wave', value: 'ribbon-wave-graphic' },
    { label: 'Sine Flute', value: 'sine-flute-graphic' },
    { label: 'Sine Wave', value: 'sine-wave-graphic' },
    { label: 'Squares Rotating', value: 'squares-rotating-graphic' },
    { label: 'Swooping Lines', value: 'swooping-lines' },
    { label: 'Target', value: 'target-graphic' },
    { label: 'Target Plane', value: 'target-plane-graphic' },
    { label: 'Waveform', value: 'waveform-graphic' },
];

const CARD_GEO_LIST_TEMPLATE = [
    ['observata/card-geo-list', { cardTitle: 'Unified Data Ingestion', listItem1: 'Centralise all your observability data into one platform', listItem2: 'Unify logs, metrics, and traces across your entire stack', iconGeo: '01' }],
];

export default function GridCardsGraphicEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-grid-cards-graphic-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards Graphic" />

            <div className="observata-controls">

                <SelectControl
                    label="Background Graphic"
                    value={attributes.backgroundGraphic}
                    options={SCIENCE_GRAPHICS}
                    onChange={(value) => setAttributes({ backgroundGraphic: value })}
                />
            </div>

            <div className="cards-container">
                <InnerBlocks
                    template={CARD_GEO_LIST_TEMPLATE}
                    templateLock="insert"
                    allowedBlocks={['observata/card-geo-list', 'observata/card-geo-tech']}
                />
            </div>
        </div>
    );
}
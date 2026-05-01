import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

const graphicOptions = [
    { label: __('None', 'observata'), value: '' },
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

export default function CardTechEdit({ attributes, setAttributes }) {
    const { cardTitle, cardText, iconGeo, backgroundGraphic } = attributes;
    const blockProps = useBlockProps({ className: 'card-tech' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Tech" />

            <div className="intro-card-icon is-placeholder">
                <span className="icon-geo">{iconGeo}</span>
            </div>
            <div className="intro-card-body">
                <RichText
                    tagName="h3"
                    className="intro-card-title"
                    value={cardTitle}
                    onChange={(val) => setAttributes({ cardTitle: val })}
                    placeholder={__('Card title…', 'observata')}
                />
                <RichText
                    tagName="p"
                    className="intro-card-text"
                    value={cardText}
                    onChange={(val) => setAttributes({ cardText: val })}
                    placeholder={__('Card description…', 'observata')}
                />
                <SelectControl
                    label={__('Geo Icon', 'observata')}
                    value={iconGeo}
                    options={iconOptions}
                    onChange={(val) => setAttributes({ iconGeo: val })}
                />
                <SelectControl
                    label={__('Background Graphic', 'observata')}
                    value={backgroundGraphic}
                    options={graphicOptions}
                    onChange={(val) => setAttributes({ backgroundGraphic: val })}
                />
            </div>
        </article>
    );
}
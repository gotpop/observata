import { RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const GRAPHIC_OPTIONS = [
    { label: 'Ribbon Star', value: 'ribbon-star' },
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

export default function SectionCardAndGraphicEdit({ attributes, setAttributes }) {
    const { heading, bodyText, graphic, graphicPosition } = attributes;
    const blockProps = useBlockProps({
        className: `block-section-card-and-graphic graphic-${graphicPosition}`,
    });

    return (
        <section {...blockProps}>
            <div className="block-content">
                <div className="section-card-and-graphic__inner">
                    <div className="section-card-and-graphic__visual">
                        <img
                            src={`${window.observata?.templateUrl || ''}/assets/svg/graphics/${graphic}-graphic.svg`}
                            alt={`${graphic} graphic`}
                        />
                    </div>
                    <div className="section-card-and-graphic__body">
                        <div className="observata-controls">
                            <RichText
                                tagName="h2"
                                className="section-card-and-graphic__heading"
                                value={heading}
                                onChange={(val) => setAttributes({ heading: val })}
                                placeholder={__('Heading…', 'observata')}
                            />
                            <RichText
                                tagName="p"
                                className="section-card-and-graphic__text"
                                value={bodyText}
                                onChange={(val) => setAttributes({ bodyText: val })}
                                placeholder={__('Body text…', 'observata')}
                            />
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
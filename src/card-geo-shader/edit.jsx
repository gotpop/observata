import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import GeoIcon from '../components/geo-icon';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

export default function CardGeoShaderEdit({ attributes, setAttributes }) {
    const { cardTitle, cardText, iconGeo, shaderColour = "blue" } = attributes;
    const blockProps = useBlockProps();

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Geo Shader" />
            <div className="intro-card-icon">
                <GeoIcon number={iconGeo} />
            </div>
            <div className="card-body">
                <RichText
                    tagName="h3"
                    className="card-title"
                    value={cardTitle}
                    onChange={(val) => setAttributes({ cardTitle: val })}
                    placeholder={__('Card title…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <RichText
                    tagName="p"
                    className="card-text"
                    value={cardText}
                    onChange={(val) => setAttributes({ cardText: val })}
                    placeholder={__('Card text…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <SelectControl
                    label={__('Icon geo', 'observata')}
                    value={iconGeo}
                    options={iconOptions}
                    onChange={(val) => setAttributes({ iconGeo: val })}
                />
                <SelectControl
                    label={__('Shader colour', 'observata')}
                    value={shaderColour}
                    options={[
                        { label: __('Blue', 'observata'), value: 'blue' },
                        { label: __('Pink', 'observata'), value: 'pink' },
                    ]}
                    onChange={(val) => setAttributes({ shaderColour: val })}
                />
            </div>
        </article>
    );
}
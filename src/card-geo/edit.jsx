import { RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

export default function CardGeoEdit({ attributes, setAttributes }) {
    const { cardTitle, cardText, iconGeo } = attributes;
    const blockProps = useBlockProps({ className: 'card-geo' });

    return (
        <article {...blockProps}>
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
                    label={__('Icon', 'observata')}
                    value={iconGeo}
                    options={iconOptions}
                    onChange={(val) => setAttributes({ iconGeo: val })}
                />
            </div>
        </article>
    );
}
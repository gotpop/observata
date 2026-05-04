import { RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import GeoIcon from '../components/geo-icon';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

export default function CardGeoEdit({ attributes, setAttributes }) {
    const { cardTitle, cardText, iconGeo } = attributes;
    const blockProps = useBlockProps({ className: 'card-geo' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Geo" />

            <div className="intro-card-icon">
                <GeoIcon number={iconGeo} />
            </div>
            <div className="intro-card-body">
                <RichText
                    className="intro-card-title"
                    disableLineBreaks
                    onChange={(val) => setAttributes({ cardTitle: val })}
                    placeholder={__('Card title…', 'observata')}
                    tagName="h3"
                    value={cardTitle}
                />
                <RichText
                    className="intro-card-text"
                    disableLineBreaks
                    onChange={(val) => setAttributes({ cardText: val })}
                    placeholder={__('Card description…', 'observata')}
                    tagName="p"
                    value={cardText}
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
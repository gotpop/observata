import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import GeoIcon from '../components/geo-icon';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

export default function CardGeoListEdit({ attributes, setAttributes }) {
    const { cardTitle, listItem1, listItem2, iconGeo } = attributes;
    const blockProps = useBlockProps({ className: 'card-geo-list' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Geo List" />

            <div className="intro-card-icon">
                <GeoIcon number={iconGeo} />
            </div>
            <div className="intro-card-body">
                <RichText
                    tagName="h3"
                    className="intro-card-title"
                    value={cardTitle}
                    onChange={(val) => setAttributes({ cardTitle: val })}
                    placeholder={__('Card title…', 'observata')}
                    disableLineBreaks
                />
                <ul className="card-geo-list-items">
                    <li>
                        <RichText
                            tagName="span"
                            value={listItem1}
                            onChange={(val) => setAttributes({ listItem1: val })}
                            placeholder={__('List item 1…', 'observata')}
                            disableLineBreaks
                        />
                    </li>
                    <li>
                        <RichText
                            tagName="span"
                            value={listItem2}
                            onChange={(val) => setAttributes({ listItem2: val })}
                            placeholder={__('List item 2…', 'observata')}
                            disableLineBreaks
                        />
                    </li>
                </ul>
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
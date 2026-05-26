import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';
import { SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import GeoIcon from '../components/geo-icon';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

export default function CardGeoListEdit({ attributes, setAttributes }) {
    const { cardTitle, listItem1, listItem2, iconGeo, showReadMore, readMoreText, readMoreUrl } = attributes;
    const blockProps = useBlockProps({ className: 'card-geo-list' });

    const pages = useSelect((select) => {
        return select('core').getEntityRecords('postType', 'page', { per_page: -1, _fields: ['id', 'title', 'link'] }) || [];
    }, []);

    const pageOptions = [
        { label: __('Select a page...', 'observata'), value: '' },
        ...pages.map((page) => ({
            label: page.title.rendered,
            value: page.link,
        })),
    ];

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
                    allowedFormats={[]}
                />
                <ul className="card-geo-list-items">
                    <li>
                        <RichText
                            tagName="span"
                            value={listItem1}
                            onChange={(val) => setAttributes({ listItem1: val })}
                            placeholder={__('List item 1…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                    </li>
                    <li>
                        <RichText
                            tagName="span"
                            value={listItem2}
                            onChange={(val) => setAttributes({ listItem2: val })}
                            placeholder={__('List item 2…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                    </li>
                </ul>
                <SelectControl
                    label={__('Icon', 'observata')}
                    value={iconGeo}
                    options={iconOptions}
                    onChange={(val) => setAttributes({ iconGeo: val })}
                />
                <ToggleControl
                    label={__('Show Read More Link', 'observata')}
                    checked={showReadMore}
                    onChange={(val) => setAttributes({ showReadMore: val })}
                />
                {showReadMore && (
                    <>
                        <TextControl
                            label={__('Read More Text', 'observata')}
                            value={readMoreText}
                            onChange={(val) => setAttributes({ readMoreText: val })}
                        />
                        <SelectControl
                            label={__('Read More Link', 'observata')}
                            value={readMoreUrl}
                            options={pageOptions}
                            onChange={(val) => setAttributes({ readMoreUrl: val })}
                        />
                    </>
                )}
            </div>
        </article>
    );
}
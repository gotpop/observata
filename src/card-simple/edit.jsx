import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import GeoIcon from '../components/geo-icon';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

export default function Edit({ attributes, setAttributes }) {
    const { title, description, iconGeo, readMoreText, readMoreUrl } = attributes;

    // Fetch internal pages for dropdown
    const pages = useSelect(select => {
        const { getEntityRecords } = select('core');
        return getEntityRecords('postType', 'page', { per_page: 100, _fields: 'id,title,link' });
    }, []);

    const pageOptions = [
        { label: __('Select a page...', 'observata'), value: '' },
        ...(pages || []).map(page => ({
            label: page.title?.rendered || `Page ${page.id}`,
            value: page.link
        }))
    ];

    const blockProps = useBlockProps({ className: 'card-simple' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Simple" />

            <div className="intro-card-icon">
                <GeoIcon number={iconGeo} />
            </div>
            <div className="intro-card-body">
                <RichText
                    tagName="h3"
                    className="heading-md"
                    value={title}
                    onChange={(val) => setAttributes({ title: val })}
                    placeholder={__('Card title…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <RichText
                    tagName="p"
                    className="body-md"
                    value={description}
                    onChange={(val) => setAttributes({ description: val })}
                    placeholder={__('Card description…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <SelectControl
                    label={__('Icon', 'observata')}
                    value={iconGeo}
                    options={iconOptions}
                    onChange={(val) => setAttributes({ iconGeo: val })}
                />
                <SelectControl
                    label={__('Read More URL', 'observata')}
                    value={readMoreUrl}
                    options={pageOptions}
                    onChange={(val) => setAttributes({ readMoreUrl: val })}
                />
                <RichText
                    tagName="span"
                    value={readMoreText}
                    onChange={(val) => setAttributes({ readMoreText: val })}
                    placeholder={__('Read more text…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
            </div>
        </article>
    );
}
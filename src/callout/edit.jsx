import { RichText, useBlockProps } from '@wordpress/block-editor';
import { SelectControl, TextControl } from '@wordpress/components';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

export default function CalloutEdit({ attributes, setAttributes }) {
    const { title, text, variant, ctaText, ctaUrl } = attributes;
    const blockProps = useBlockProps({
        className: `wp-block-observata-callout is-${variant}`,
    });

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
        <aside {...blockProps}>
            <BlockLabel name="Callout" />

            <div className="callout-inner">
                <SelectControl
                    label={__('Variant', 'observata')}
                    value={variant}
                    options={[
                        { label: __('Info', 'observata'), value: 'info' },
                        { label: __('Warning', 'observata'), value: 'warning' },
                        { label: __('Success', 'observata'), value: 'success' },
                    ]}
                    onChange={(val) => setAttributes({ variant: val })}
                />
                <RichText
                    tagName="h3"
                    className="callout-title"
                    value={title}
                    onChange={(val) => setAttributes({ title: val })}
                    placeholder={__('Callout title…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <RichText
                    tagName="p"
                    className="callout-text"
                    value={text}
                    onChange={(val) => setAttributes({ text: val })}
                    placeholder={__('Callout message…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <TextControl
                    label={__('CTA Text (optional)', 'observata')}
                    value={ctaText}
                    onChange={(val) => setAttributes({ ctaText: val })}
                />
                <SelectControl
                    label={__('CTA Link (optional)', 'observata')}
                    value={ctaUrl}
                    options={pageOptions}
                    onChange={(val) => setAttributes({ ctaUrl: val })}
                />
            </div>
        </aside>
    );
}


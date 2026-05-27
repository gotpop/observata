import { RichText, useBlockProps } from '@wordpress/block-editor';
import { SelectControl, TextControl } from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

export default function SectionCtaEdit({ attributes, setAttributes }) {
    const { title, text, ctaText, ctaUrl, sectionBgColour } = attributes;
    const blockProps = useBlockProps();

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
        <section {...blockProps}>
            <BlockLabel name="Section CTA" />
            <SelectControl
                label={__('Section Background', 'observata')}
                value={sectionBgColour}
                options={[
                    { label: __('White', 'observata'), value: 'white' },
                    { label: __('Grey', 'observata'), value: 'grey' },
                ]}
                onChange={(val) => setAttributes({ sectionBgColour: val })}
            />

            <div className="section-cta-inner">
                <RichText
                    tagName="h3"
                    className="section-cta-title"
                    value={title}
                    onChange={(val) => setAttributes({ title: val })}
                    placeholder={__('Section title…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <RichText
                    tagName="p"
                    className="section-cta-text"
                    value={text}
                    onChange={(val) => setAttributes({ text: val })}
                    placeholder={__('Section content…', 'observata')}
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
        </section>
    );
}


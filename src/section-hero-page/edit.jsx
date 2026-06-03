import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';
import { SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

export default function SectionHeroPageEdit({ attributes, setAttributes }) {
    const { heading, subheading, showCta, ctaText, ctaUrl } = attributes;
    const blockProps = useBlockProps({
        className: 'block-section-hero-page',
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
        <section {...blockProps}>
            <BlockLabel name="Section Hero Page" />

            <div className="hero-page-content">
                <div className="hero-page-text">
                    <RichText
                        tagName="h1"
                        className="heading-hero-page"
                        value={heading}
                        disableLineBreaks
                        onChange={(val) => setAttributes({ heading: val })}
                        placeholder={__('Page heading…', 'observata')}
                        allowedFormats={[]}
                    />
                    <RichText
                        disableLineBreaks
                        tagName="p"
                        className="body-hero-page"
                        value={subheading}
                        onChange={(val) => setAttributes({ subheading: val })}
                        placeholder={__('Subheading text…', 'observata')}
                        allowedFormats={[]}
                    />
                    <ToggleControl
                        label={__('Show CTA Button', 'observata')}
                        checked={showCta}
                        onChange={(val) => setAttributes({ showCta: val })}
                    />
                    {showCta && (
                        <>
                            <TextControl
                                label={__('CTA Text', 'observata')}
                                value={ctaText}
                                onChange={(val) => setAttributes({ ctaText: val })}
                            />
                            <SelectControl
                                label={__('CTA Link', 'observata')}
                                value={ctaUrl}
                                options={pageOptions}
                                onChange={(val) => setAttributes({ ctaUrl: val })}
                            />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
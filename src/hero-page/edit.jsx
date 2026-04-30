import { RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

export default function HeroPageEdit({ attributes, setAttributes }) {
    const { heading, subheading } = attributes;
    const blockProps = useBlockProps({
        className: 'block-hero-page',
    });

    return (
        <section {...blockProps}>
            <div className="hero-page-content">
                <div className="hero-page-text">
                    <RichText
                        tagName="h1"
                        className="heading-hero-page"
                        value={heading}
                        onChange={(val) => setAttributes({ heading: val })}
                        placeholder={__('Page heading…', 'observata')}
                    />
                    <RichText
                        tagName="p"
                        className="hero-page-subheading"
                        value={subheading}
                        onChange={(val) => setAttributes({ subheading: val })}
                        placeholder={__('Subheading text…', 'observata')}
                    />
                </div>
            </div>
        </section>
    );
}
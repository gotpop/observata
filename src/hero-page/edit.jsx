import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

export default function HeroPageEdit({ attributes, setAttributes }) {
    const { heading, subheading } = attributes;
    const blockProps = useBlockProps({
        className: 'block-hero-page',
    });

    return (
        <section {...blockProps}>
            <BlockLabel name="Hero Page" />

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
                </div>
            </div>
        </section>
    );
}
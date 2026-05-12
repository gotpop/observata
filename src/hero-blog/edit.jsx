import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

export default function HeroBlogEdit({ attributes, setAttributes }) {
    const { heading, subheading } = attributes;
    const blockProps = useBlockProps({
        className: 'block-hero-blog',
    });

    return (
        <section {...blockProps}>
            <BlockLabel name="Hero Blog" />

            <div className="hero-blog-content">
                <div className="hero-blog-text">
                    <RichText
                        tagName="h1"
                        className="heading-hero-blog"
                        value={heading}
                        disableLineBreaks
                        onChange={(val) => setAttributes({ heading: val })}
                        placeholder={__('Page heading…', 'observata')}
                        allowedFormats={[]}
                    />
                    <RichText
                        disableLineBreaks
                        tagName="p"
                        className="body-hero body-hero-blog"
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

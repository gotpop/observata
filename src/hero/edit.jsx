import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function HeroEdit({ attributes, setAttributes }) {
    const { heading, subheading, mediaUrl, mediaId, ctaText, ctaUrl } = attributes;
    const blockProps = useBlockProps({
        className: 'block-hero-home',
        style: mediaUrl ? { backgroundImage: `url(${mediaUrl})` } : {},
    });

    return (
        <section {...blockProps}>
            <BlockLabel name="Hero" />

            <div className="hero-content">
                <div className="hero-text">
                    <RichText
                        tagName="h1"
                        className="heading-hero"
                        value={heading}
                        onChange={(val) => setAttributes({ heading: val })}
                        placeholder={__('Hero heading…', 'observata')}
                    />
                    <RichText
                        tagName="p"
                        className="hero-subheading"
                        value={subheading}
                        onChange={(val) => setAttributes({ subheading: val })}
                        placeholder={__('Subheading…', 'observata')}
                    />
                </div>

                <div className="hero-buttons">
                    <div className="hero-cta-fields">
                        <TextControl
                            label={__('CTA Text', 'observata')}
                            value={ctaText}
                            onChange={(val) => setAttributes({ ctaText: val })}
                        />
                        <TextControl
                            label={__('CTA URL', 'observata')}
                            value={ctaUrl}
                            onChange={(val) => setAttributes({ ctaUrl: val })}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
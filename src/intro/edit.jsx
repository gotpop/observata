import { RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

export default function IntroEdit({ attributes, setAttributes }) {
    const { sectionTitle } = attributes;
    const blockProps = useBlockProps({
        className: 'block-intro',
    });

    return (
        <section {...blockProps}>
            <div className="logo-strip is-placeholder">
                <span>AF</span>
                <span>Tele2</span>
                <span>Elastic</span>
                <span>CrowdStrike</span>
            </div>

            <RichText
                tagName="h2"
                className="intro-section-title"
                value={sectionTitle}
                onChange={(value) => setAttributes({ sectionTitle: value })}
                placeholder={__('Intro section title…', 'observata')}
            />

            <div className="cards-container is-placeholder">
                <div className="intro-card-placeholder">{__('Embedded experts', 'observata')}</div>
                <div className="intro-card-placeholder">{__('One fee — Zero surprises', 'observata')}</div>
                <div className="intro-card-placeholder">{__('Achieve higher ROI', 'observata')}</div>
            </div>
        </section>
    );
}
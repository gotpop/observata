import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import SectionIntro from '../components/section-intro';

export default function Edit({ attributes, setAttributes }) {
    const {
        sectionTitle,
        introText,
        ctaText,
        ctaUrl,
        phase1Title,
        phase1ItemTitle1,
        phase1Text1,
        phase1ItemTitle2,
        phase1Text2,
        phase2Title,
        phase2ItemTitle1,
        phase2Text1,
        phase2Text2,
    } = attributes;

    const blockProps = useBlockProps({ className: 'block-partnership' });

    return (
        <section {...blockProps}>
            <BlockLabel name="Partnership" />
            <SectionIntro attributes={attributes} setAttributes={setAttributes} />

            <div className="block-content">
                <div className="block-body">
                    <article className="phase phase-one">
                        <div className="phase-header">
                            <RichText
                                tagName="h3"
                                className="phase-title"
                                value={phase1Title}
                                onChange={(val) => setAttributes({ phase1Title: val })}
                                placeholder={__('Phase title…', 'observata')}
                            />
                        </div>
                        <div className="phase-content">
                            <div className="phase-item">
                                <RichText
                                    tagName="h4"
                                    className="phase-item-title"
                                    value={phase1ItemTitle1}
                                    onChange={(val) => setAttributes({ phase1ItemTitle1: val })}
                                    placeholder={__('Item title…', 'observata')}
                                />
                                <RichText
                                    tagName="p"
                                    className="phase-text"
                                    value={phase1Text1}
                                    onChange={(val) => setAttributes({ phase1Text1: val })}
                                    placeholder={__('Phase text…', 'observata')}
                                />
                            </div>
                            <div className="phase-item">
                                <RichText
                                    tagName="h4"
                                    className="phase-item-title"
                                    value={phase1ItemTitle2}
                                    onChange={(val) => setAttributes({ phase1ItemTitle2: val })}
                                    placeholder={__('Item title…', 'observata')}
                                />
                                <RichText
                                    tagName="p"
                                    className="phase-text"
                                    value={phase1Text2}
                                    onChange={(val) => setAttributes({ phase1Text2: val })}
                                    placeholder={__('Phase text…', 'observata')}
                                />
                            </div>
                        </div>
                    </article>

                    <article className="phase phase-two">
                        <div className="phase-header">
                            <RichText
                                tagName="h3"
                                className="phase-title"
                                value={phase2Title}
                                onChange={(val) => setAttributes({ phase2Title: val })}
                                placeholder={__('Phase title…', 'observata')}
                            />
                        </div>
                        <div className="phase-content">
                            <div className="phase-item">
                                <RichText
                                    tagName="h4"
                                    className="phase-item-title"
                                    value={phase2ItemTitle1}
                                    onChange={(val) => setAttributes({ phase2ItemTitle1: val })}
                                    placeholder={__('Item title…', 'observata')}
                                />
                                <RichText
                                    tagName="p"
                                    className="phase-text"
                                    value={phase2Text1}
                                    onChange={(val) => setAttributes({ phase2Text1: val })}
                                    placeholder={__('Phase text…', 'observata')}
                                />
                            </div>
                        </div>
                    </article>

                    <div className="cta-primary cta-partnership">
                        <RichText
                            tagName="span"
                            value={ctaText}
                            onChange={(val) => setAttributes({ ctaText: val })}
                            placeholder={__('CTA text…', 'observata')}
                        />
                        <span className="arrow-icon">→</span>
                    </div>
                </div>

                <div className="observata-controls">
                    <TextControl
                        label={__('CTA URL', 'observata')}
                        value={ctaUrl}
                        onChange={(val) => setAttributes({ ctaUrl: val })}
                    />
                </div>
            </div>
        </section>
    );
}
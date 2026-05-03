import { RichText, useBlockProps } from '@wordpress/block-editor';

import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import SectionIntro from '../components/section-intro';

export default function Edit({ attributes, setAttributes }) {
    const {
        sectionTitle,
        ctaText,
        ctaUrl,
        phase1Number,
        phase1Title,
        phase1Text1,
        phase1Text2,
        phase2Number,
        phase2Title,
        phase2Text1,
        phase2Text2,
    } = attributes;

    const blockProps = useBlockProps({ className: 'block-partnership' });

    return (
        <section {...blockProps}>
            <BlockLabel name="Partnership" />
            <SectionIntro attributes={attributes} setAttributes={setAttributes} />

            <div className="block-content">

                <div className="phases-wrap">
                    <div className="phase">
                        <div className="phase-box">
                            <RichText
                                tagName="div"
                                className="phase-title"
                                value={phase1Title}
                                onChange={(val) => setAttributes({ phase1Title: val })}
                                placeholder={__('Phase title…', 'observata')}
                            />
                        </div>
                        <div className="phase-content">
                            <RichText
                                tagName="p"
                                className="phase-text"
                                value={phase1Text1}
                                onChange={(val) => setAttributes({ phase1Text1: val })}
                                placeholder={__('Phase text…', 'observata')}
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

                    <div className="phase">
                        <div className="phase-box">
                            <RichText
                                tagName="div"
                                className="phase-title"
                                value={phase2Title}
                                onChange={(val) => setAttributes({ phase2Title: val })}
                                placeholder={__('Phase title…', 'observata')}
                            />
                        </div>
                        <div className="phase-content">
                            <RichText
                                tagName="p"
                                className="phase-text"
                                value={phase2Text1}
                                onChange={(val) => setAttributes({ phase2Text1: val })}
                                placeholder={__('Phase text…', 'observata')}
                            />
                        </div>
                    </div>
                </div>

                <div className="icon-container">
                    <div className="icon-circle"></div>
                    <div className="arrow-icon"></div>
                </div>

                <div className="observata-controls">
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
        </section>
    );
}
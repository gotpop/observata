import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function SectionIntro({ attributes, setAttributes }) {
    return (
        <div className="section-intro-editor">
            <RichText
                tagName="h2"
                className="section-intro-title"
                value={attributes.sectionTitle}
                onChange={(value) => setAttributes({ sectionTitle: value })}
                placeholder={__('Section title…', 'observata')}
            />
            <RichText
                tagName="p"
                className="section-intro-text"
                value={attributes.introText}
                onChange={(value) => setAttributes({ introText: value })}
                placeholder={__('Intro text…', 'observata')}
            />
        </div>
    );
}
import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function CardTextIntroEdit({ attributes, setAttributes }) {
    const { sectionTitle, introText, textAlign } = attributes;
    const blockProps = useBlockProps({ className: 'card-text-intro-editor' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Text Intro" />
            <SelectControl
                label={__('Text Alignment', 'observata')}
                value={textAlign}
                options={[
                    { label: __('Left', 'observata'), value: 'left' },
                    { label: __('Center', 'observata'), value: 'center' },
                ]}
                onChange={(val) => setAttributes({ textAlign: val })}
            />
            <div className="card-text-intro-content">
                <RichText
                    tagName="h2"
                    className="card-text-intro-title"
                    value={sectionTitle}
                    onChange={(value) => setAttributes({ sectionTitle: value })}
                    placeholder={__('Section title…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <RichText
                    tagName="p"
                    className="card-text-intro-text"
                    value={introText}
                    onChange={(value) => setAttributes({ introText: value })}
                    placeholder={__('Intro text…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
            </div>
        </article>
    );
}
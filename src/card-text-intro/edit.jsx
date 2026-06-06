import './editor.css';

import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const INTRO_TEMPLATE = [
    ['observata/element-body-md', { content: 'Intro text description here.' }],
];

export default function CardTextIntroEdit({ attributes, setAttributes }) {
    const { sectionTitle, textAlign } = attributes;
    const blockProps = useBlockProps({ className: 'card-text-intro-editor' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Text Intro">
                <SelectControl
                    label={__('Text Alignment', 'observata')}
                    value={textAlign}
                    options={[
                        { label: __('Left', 'observata'), value: 'left' },
                        { label: __('Center', 'observata'), value: 'center' },
                    ]}
                    onChange={(val) => setAttributes({ textAlign: val })}
                />
            </BlockLabel>
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
                <InnerBlocks
                    template={INTRO_TEMPLATE}
                    templateLock={false}
                    allowedBlocks={['observata/element-body-md']}
                    renderAppender={InnerBlocks.ButtonBlockAppender}
                />
            </div>
        </article>
    );
}
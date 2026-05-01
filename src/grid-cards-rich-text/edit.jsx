import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const CARD_TEMPLATE = [
    ['observata/card-rich-text', {
        cardTitle: 'Card Title One',
        cardContent: 'Add your rich text content here. You can include detailed descriptions, lists, and more.',
    }],
    ['observata/card-rich-text', {
        cardTitle: 'Card Title Two',
        cardContent: 'Add your rich text content here. You can include detailed descriptions, lists, and more.',
    }],
    ['observata/card-rich-text', {
        cardTitle: 'Card Title Three',
        cardContent: 'Add your rich text content here. You can include detailed descriptions, lists, and more.',
    }],
];

export default function GridCardsRichTextEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'grid-cards-rich-text-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards Rich Text" />

            <div className="observata-controls">
                <TextControl
                    label={__('Section Title', 'observata')}
                    value={attributes.sectionTitle}
                    onChange={(value) => setAttributes({ sectionTitle: value })}
                />
                <TextControl
                    label={__('Intro Text', 'observata')}
                    value={attributes.introText}
                    onChange={(value) => setAttributes({ introText: value })}
                />
            </div>

            <div className="grid-cards-rich-text-editor__grid">
                <InnerBlocks
                    template={CARD_TEMPLATE}
                    allowedBlocks={['observata/card-rich-text']}
                    templateLock={false}
                />
            </div>
        </div>
    );
}
import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import SectionIntro from '../components/section-intro';

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
            <SectionIntro attributes={attributes} setAttributes={setAttributes} />

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
import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';

const CARD_TEXT_SIMPLE_TEMPLATE = [
    ['observata/card-text-simple', { heading: 'First Card', content: 'Add your content here.' }],
    ['observata/card-text-simple', { heading: 'Second Card', content: 'Add your content here.' }],
    ['observata/card-text-simple', { heading: 'Third Card', content: 'Add your content here.' }],
];

export default function GridTextEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-grid-text-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Text" />

            <div className="cards-container">
                <InnerBlocks
                    template={CARD_TEXT_SIMPLE_TEMPLATE}
                    templateLock={false}
                    allowedBlocks={['observata/card-text-simple']}
                    orientation="horizontal"
                />
            </div>
        </div>
    );
}

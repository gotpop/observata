import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';

const ALLOWED_BLOCKS = ['observata/element-list-simple-item'];
const TEMPLATE = [
    ['observata/element-list-simple-item', { content: 'First item' }],
    ['observata/element-list-simple-item', { content: 'Second item' }],
    ['observata/element-list-simple-item', { content: 'Third item' }],
];

export default function ElementListSimpleEdit() {
    const blockProps = useBlockProps({ className: 'element-list-simple-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Element List Simple" />

            <div className="element-list-simple-editor__items">
                <InnerBlocks
                    template={TEMPLATE}
                    allowedBlocks={ALLOWED_BLOCKS}
                    templateLock={false}
                    renderAppender={InnerBlocks.ButtonBlockAppender}
                />
            </div>
        </div>
    );
}
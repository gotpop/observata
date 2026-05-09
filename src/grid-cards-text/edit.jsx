import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';

const CARD_TEXT_SIMPLE_TEMPLATE = [
    ['observata/card-text-simple', { heading: 'Lorem Ipsum', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }],
    ['observata/card-text-simple', { heading: 'Dolor Sit Amet', content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' }],
    ['observata/card-text-simple', { heading: 'Consectetur Adipiscing', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' }],
    ['observata/card-text-simple', { heading: 'Sed Do Eiusmod', content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }],
];

export default function GridCardsTextEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-grid-cards-text-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards Text" />

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

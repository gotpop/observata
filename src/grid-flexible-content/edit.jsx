import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const CARD_TEXT_SIMPLE_TEMPLATE = [
    ['observata/card-text-simple', { heading: 'Lorem Ipsum', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }],
    ['observata/card-text-simple', { heading: 'Dolor Sit Amet', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }],
    ['observata/card-text-simple', { heading: 'Consectetur Adipiscing', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }],
    ['observata/card-text-simple', { heading: 'Sed Do Eiusmod', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }],
];

export default function GridFlexibleContentEdit({ attributes, setAttributes }) {
    const { sectionBgColour, layout } = attributes;
    const blockProps = useBlockProps({
        className: 'observata-grid-flexible-content-editor',
    });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Flexible Content" />
            <SelectControl
                label={__('Section Background', 'observata')}
                value={sectionBgColour}
                onChange={(val) => setAttributes({ sectionBgColour: val })}
                options={[
                    { label: __('White', 'observata'), value: 'white' },
                    { label: __('Grey', 'observata'), value: 'grey' },
                    { label: __('Gradient', 'observata'), value: 'gradient' },
                ]}
            />
            <SelectControl
                label={__('Layout', 'observata')}
                value={layout}
                onChange={(val) => setAttributes({ layout: val })}
                options={[
                    { label: __('1 Column', 'observata'), value: '1' },
                    { label: __('2 Columns', 'observata'), value: '2' },
                    { label: __('3 Columns', 'observata'), value: '3' },
                ]}
            />

            <div className="cards-container">
                <InnerBlocks
                    template={CARD_TEXT_SIMPLE_TEMPLATE}
                    templateLock={false}
                    allowedBlocks={['observata/card-text-simple', 'observata/card-text-intro', 'observata/card-table-simple']}
                    orientation="horizontal"
                />
            </div>
        </div>
    );
}
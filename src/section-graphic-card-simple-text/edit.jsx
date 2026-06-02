import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const SCIENCE_GRAPHICS = [
    { label: 'None', value: '' },
    { label: 'Europe', value: 'europe-dots-graphic' },
    ...Array.from({ length: 18 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) })),
];

const CARD_TEXT_SIMPLE_TEMPLATE = [
    ['observata/card-text-simple', { heading: 'Card Heading' }],
];

export default function SectionGraphicCardSimpleTextEdit({ attributes, setAttributes }) {
    const { sectionBgColour } = attributes;
    const blockProps = useBlockProps({ className: 'observata-section-graphic-card-simple-text-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Section Graphic Card Simple Text">
                <SelectControl
                    label={__('Section Background', 'observata')}
                    value={sectionBgColour}
                    options={[
                        { label: __('White', 'observata'), value: 'white' },
                        { label: __('Grey', 'observata'), value: 'grey' },
                    ]}
                    onChange={(value) => setAttributes({ sectionBgColour: value })}
                />
                <SelectControl
                    label="Background Graphic"
                    value={attributes.backgroundGraphic}
                    options={SCIENCE_GRAPHICS}
                    onChange={(value) => setAttributes({ backgroundGraphic: value })}
                />
            </BlockLabel>

            <div className="card-container">
                <InnerBlocks
                    template={CARD_TEXT_SIMPLE_TEMPLATE}
                    templateLock="insert"
                    allowedBlocks={['observata/card-text-simple']}
                />
            </div>
        </div>
    );
}
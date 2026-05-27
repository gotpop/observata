import './editor.css';

import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const ALLOWED_BLOCKS = ['observata/body-md', 'observata/table-simple'];

export default function TableSectionEdit({ attributes, setAttributes }) {
    const { sectionBgColour } = attributes;
    const blockProps = useBlockProps({ className: 'table-section-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Table Section">
            </BlockLabel>

            <SelectControl
                label={__('Section Background', 'observata')}
                value={sectionBgColour}
                options={[
                    { label: __('White', 'observata'), value: 'white' },
                    { label: __('Grey', 'observata'), value: 'grey' },
                ]}
                onChange={(val) => setAttributes({ sectionBgColour: val })}
            />

            <RichText
                tagName="h2"
                className="table-section-editor__title"
                value={attributes.sectionTitle}
                onChange={(value) => setAttributes({ sectionTitle: value })}
                placeholder={__('Enter section title…', 'observata')}
                disableLineBreaks
                allowedFormats={[]}
            />

            <div className="table-section-editor__inner-blocks">
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    templateLock={false}
                    orientation="vertical"
                    renderAppender={InnerBlocks.ButtonBlockAppender}
                />
            </div>
        </div>
    );
}
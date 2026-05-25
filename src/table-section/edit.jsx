import './editor.css';

import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = ['observata/body-md', 'observata/table-simple'];

export default function TableSectionEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'table-section-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Table Section">
            </BlockLabel>

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
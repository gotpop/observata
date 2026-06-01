import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const ROW_TEMPLATE = [
    ['observata/table-simple-row', { rowLabel: '', column2Value: '', column3Value: '' }],
];

export default function CardTableSimpleEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'card-table-simple-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Card Table Simple">
            </BlockLabel>

            <div className="card-table-simple-editor__columns">
                <TextControl
                    label={__('Column 1 Label', 'observata')}
                    value={attributes.column1Label}
                    onChange={(value) => setAttributes({ column1Label: value })}
                />
                <TextControl
                    label={__('Column 2 Label', 'observata')}
                    value={attributes.column2Label}
                    onChange={(value) => setAttributes({ column2Label: value })}
                />
                <TextControl
                    label={__('Column 3 Label', 'observata')}
                    value={attributes.column3Label}
                    onChange={(value) => setAttributes({ column3Label: value })}
                />
            </div>

            <div className="card-table-simple-editor__rows">
                <strong>{__('Table Rows (drag to reorder)', 'observata')}</strong>
                <InnerBlocks
                    template={ROW_TEMPLATE}
                    allowedBlocks={['observata/table-simple-row']}
                    templateLock={false}
                    renderAppender={InnerBlocks.ButtonBlockAppender}
                />
            </div>
        </div>
    );
}
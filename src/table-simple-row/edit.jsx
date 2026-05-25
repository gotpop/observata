import './editor.css';

import BlockLabel from '../components/block-label';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function TableSimpleRowEdit({ attributes, setAttributes }) {
    const { rowLabel, column2Value, column3Value } = attributes;
    const blockProps = useBlockProps({ className: 'table-simple-row-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Table Row" />

            <div className="table-simple-row-editor__controls">
                <TextControl
                    label={__('Column 1 (Label)', 'observata')}
                    value={rowLabel}
                    onChange={(val) => setAttributes({ rowLabel: val })}
                    placeholder={__('e.g. Feature name', 'observata')}
                />

                <TextControl
                    label={__('Column 2', 'observata')}
                    value={column2Value}
                    onChange={(val) => setAttributes({ column2Value: val })}
                    placeholder={__('e.g. Value', 'observata')}
                />

                <TextControl
                    label={__('Column 3', 'observata')}
                    value={column3Value}
                    onChange={(val) => setAttributes({ column3Value: val })}
                    placeholder={__('e.g. Value', 'observata')}
                />
            </div>
        </div>
    );
}
import './editor.css';

import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

export default function ElementTableSimpleRowEdit({ attributes, setAttributes }) {
    const { rowLabel, column2Value, column3Value } = attributes;
    const blockProps = useBlockProps({ className: 'element-table-simple-row-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Element Table Row" />

            <div className="element-table-simple-row-editor__controls">
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
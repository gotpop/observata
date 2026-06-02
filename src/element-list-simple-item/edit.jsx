import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

export default function ElementListSimpleItemEdit({ attributes, setAttributes }) {
    const { content } = attributes;
    const blockProps = useBlockProps({ className: 'element-list-simple-item-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Element List Simple Item" />
            <RichText
                tagName="div"
                value={content}
                onChange={(value) => setAttributes({ content: value })}
                placeholder={__('List item', 'observata')}
                withoutInteractiveFormatting
            />
        </div>
    );
}
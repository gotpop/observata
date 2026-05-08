import { RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

export default function RichTextEdit({ attributes, setAttributes }) {
    const { content } = attributes;
    const blockProps = useBlockProps({ className: 'rich-text-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Rich Text" />
            <RichText
                tagName="div"
                className="rich-text__content"
                value={content}
                onChange={(val) => setAttributes({ content: val })}
                placeholder={__('Add your content here…', 'observata')}
                multiline="p"
                allowedFormats={[
                    'core/bold',
                    'core/italic',
                    'core/link',
                    'core/strikethrough',
                    'core/underline',
                    'core/subscript',
                    'core/superscript',
                    'core/text-color',
                    'core/heading',
                    'core/paragraph',
                    'core/list',
                    'core/quote',
                    'core/code'
                ]}
            />
        </div>
    );
}

import { TextControl, TextareaControl } from '@wordpress/components';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function CardRichTextEdit({ attributes, setAttributes }) {
    const { cardTitle, cardContent } = attributes;
    const blockProps = useBlockProps({ className: 'card-rich-text-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Card Rich Text" />

            <div className="card-rich-text-editor__controls">
                <TextControl
                    label={__('Title', 'observata')}
                    value={cardTitle}
                    onChange={(val) => setAttributes({ cardTitle: val })}
                    placeholder={__('Card title', 'observata')}
                />
                <TextareaControl
                    label={__('Content', 'observata')}
                    value={cardContent}
                    onChange={(val) => setAttributes({ cardContent: val })}
                    placeholder={__('Card content…', 'observata')}
                    rows={5}
                />
            </div>
        </div>
    );
}
import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

export default function CardRichTextEdit({ attributes, setAttributes }) {
    const { cardTitle, cardContent } = attributes;
    const blockProps = useBlockProps({ className: 'card-rich-text' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Rich Text" />
            <div className="card-rich-text__body">
                <RichText
                    tagName="h3"
                    className="card-rich-text__title"
                    value={cardTitle}
                    onChange={(val) => setAttributes({ cardTitle: val })}
                    placeholder={__('Card title…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <RichText
                    tagName="div"
                    className="card-rich-text__content"
                    value={cardContent}
                    onChange={(val) => setAttributes({ cardContent: val })}
                    placeholder={__('Card content…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
            </div>
        </article>
    );
}
import { RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

export default function CardMicroEdit({ attributes, setAttributes }) {
    const { cardTitle, cardDescription } = attributes;
    const blockProps = useBlockProps({ className: 'card-micro' });

    return (
        <article {...blockProps}>
            <RichText
                tagName="h3"
                className="card-micro-heading"
                value={cardTitle}
                onChange={(val) => setAttributes({ cardTitle: val })}
                placeholder={__('Card title…', 'observata')}
            />
            <RichText
                tagName="p"
                className="card-micro-body"
                value={cardDescription}
                onChange={(val) => setAttributes({ cardDescription: val })}
                placeholder={__('Card description…', 'observata')}
            />
        </article>
    );
}
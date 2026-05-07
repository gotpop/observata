import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

export default function CardMicroEdit({ attributes, setAttributes }) {
    const { cardTitle, cardDescription } = attributes;
    const blockProps = useBlockProps({ className: 'card-micro' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Micro" />

            <RichText
                tagName="h3"
                className="card-micro-heading"
                value={cardTitle}
                onChange={(val) => setAttributes({ cardTitle: val })}
                placeholder={__('Card title…', 'observata')}
                disableLineBreaks
            />
            <RichText
                tagName="p"
                className="card-micro-body"
                value={cardDescription}
                onChange={(val) => setAttributes({ cardDescription: val })}
                placeholder={__('Card description…', 'observata')}
                disableLineBreaks
            />
        </article>
    );
}
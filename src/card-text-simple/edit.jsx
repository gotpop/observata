import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

export default function CardTextSimpleEdit({ attributes, setAttributes }) {
    const { heading, content } = attributes;
    const blockProps = useBlockProps({ className: 'card-text-simple' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Text Simple" />
            <div className="card-text-simple__body">
                <RichText
                    tagName="h2"
                    className="card-text-simple__heading"
                    value={heading}
                    onChange={(val) => setAttributes({ heading: val })}
                    placeholder={__('Card heading…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <RichText
                    tagName="p"
                    className="card-text-simple__content"
                    value={content}
                    onChange={(val) => setAttributes({ content: val })}
                    placeholder={__('Card content…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
            </div>
        </article>
    );
}

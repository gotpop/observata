import { RichText, useBlockProps } from '@wordpress/block-editor';

import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function CardSwooshIconEdit({ attributes, setAttributes }) {
    const { cardTitle, cardText, iconNumber } = attributes;
    const blockProps = useBlockProps();

    return (
        <article {...blockProps}>
            <div className="swoosh-background">
                <div className="icon-circle">
                    <span className="icon-number">
                        <TextControl
                            value={iconNumber}
                            onChange={(val) => setAttributes({ iconNumber: val })}
                        />
                    </span>
                </div>
            </div>
            <div className="card-body">
                <RichText
                    tagName="h3"
                    className="card-title"
                    value={cardTitle}
                    onChange={(val) => setAttributes({ cardTitle: val })}
                    placeholder={__('Card title…', 'observata')}
                />
                <RichText
                    tagName="p"
                    className="card-text"
                    value={cardText}
                    onChange={(val) => setAttributes({ cardText: val })}
                    placeholder={__('Card text…', 'observata')}
                />
            </div>
        </article>
    );
}
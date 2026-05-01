import { RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

export default function Edit({ attributes, setAttributes }) {
    const {
        sectionTitle,
        card1Title,
        card1Text,
        card1IconNumber,
        card2Title,
        card2Text,
        card2IconNumber,
        card3Title,
        card3Text,
        card3IconNumber,
    } = attributes;

    const blockProps = useBlockProps({ className: 'block-grid-cards-simple' });

    return (
        <section {...blockProps}>
            <div className="block-content">
                <div className="cards-container">
                    <div className="card-edit">
                        <SelectControl
                            label={__('Card 1 Icon', 'observata')}
                            value={card1IconNumber}
                            options={iconOptions}
                            onChange={(val) => setAttributes({ card1IconNumber: val })}
                        />
                        <RichText
                            tagName="h3"
                            value={card1Title}
                            onChange={(val) => setAttributes({ card1Title: val })}
                            placeholder={__('Card 1 title…', 'observata')}
                        />
                        <RichText
                            tagName="p"
                            value={card1Text}
                            onChange={(val) => setAttributes({ card1Text: val })}
                            placeholder={__('Card 1 text…', 'observata')}
                        />
                    </div>

                    <div className="card-edit">
                        <SelectControl
                            label={__('Card 2 Icon', 'observata')}
                            value={card2IconNumber}
                            options={iconOptions}
                            onChange={(val) => setAttributes({ card2IconNumber: val })}
                        />
                        <RichText
                            tagName="h3"
                            value={card2Title}
                            onChange={(val) => setAttributes({ card2Title: val })}
                            placeholder={__('Card 2 title…', 'observata')}
                        />
                        <RichText
                            tagName="p"
                            value={card2Text}
                            onChange={(val) => setAttributes({ card2Text: val })}
                            placeholder={__('Card 2 text…', 'observata')}
                        />
                    </div>

                    <div className="card-edit">
                        <SelectControl
                            label={__('Card 3 Icon', 'observata')}
                            value={card3IconNumber}
                            options={iconOptions}
                            onChange={(val) => setAttributes({ card3IconNumber: val })}
                        />
                        <RichText
                            tagName="h3"
                            value={card3Title}
                            onChange={(val) => setAttributes({ card3Title: val })}
                            placeholder={__('Card 3 title…', 'observata')}
                        />
                        <RichText
                            tagName="p"
                            value={card3Text}
                            onChange={(val) => setAttributes({ card3Text: val })}
                            placeholder={__('Card 3 text…', 'observata')}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
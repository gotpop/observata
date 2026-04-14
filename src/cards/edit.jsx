import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = ['observata/card'];
const TEMPLATE = [['observata/card'], ['observata/card'], ['observata/card']];

export default function CardsEdit({ attributes, setAttributes }) {
    const { sectionTitle } = attributes;
    const blockProps = useBlockProps({ className: 'wp-block-observata-cards' });

    return (
        <div {...blockProps}>
            <RichText
                tagName="h2"
                className="cards-section-title"
                value={sectionTitle}
                onChange={(val) => setAttributes({ sectionTitle: val })}
                placeholder={__('Section title (optional)…', 'observata')}
            />
            <div className="cards-grid">
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={TEMPLATE}
                    orientation="horizontal"
                />
            </div>
        </div>
    );
}

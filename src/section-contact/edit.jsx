import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const CONTACT_TEMPLATE = [
    ['observata/section-intro', {}],
    ['observata/card-contact-details', {}],
    ['observata/card-contact-form', {}],
];

const ALLOWED_BLOCKS = [
    'observata/section-intro',
    'observata/card-contact-details',
    'observata/card-contact-form',
];

export default function ContactEdit({ attributes, setAttributes }) {
    const { sectionBgColour } = attributes;
    const blockProps = useBlockProps({ className: 'block-section-contact-editor' });

    return (
        <section {...blockProps}>
            <BlockLabel name="Section Contact">
                <SelectControl
                    label={__('Section Background', 'observata')}
                    value={sectionBgColour}
                    options={[
                        { label: __('White', 'observata'), value: 'white' },
                        { label: __('Grey', 'observata'), value: 'grey' },
                        { label: __('Gradient', 'observata'), value: 'gradient' },
                    ]}
                    onChange={(val) => setAttributes({ sectionBgColour: val })}
                />
            </BlockLabel>
            <div className="block-content">
                <InnerBlocks
                    template={CONTACT_TEMPLATE}
                    allowedBlocks={ALLOWED_BLOCKS}
                />
            </div>
        </section>
    );
}
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';

const CONTACT_TEMPLATE = [
    ['observata/section-intro', {}],
    ['observata/contact-details', {}],
    ['observata/contact-form', {}],
];

const ALLOWED_BLOCKS = [
    'observata/section-intro',
    'observata/contact-details',
    'observata/contact-form',
];

export default function ContactEdit() {
    const blockProps = useBlockProps({ className: 'block-contact-editor' });

    return (
        <section {...blockProps}>
            <BlockLabel name="Contact" />
            <div className="block-content">
                <InnerBlocks
                    template={CONTACT_TEMPLATE}
                    templateLock="all"
                    allowedBlocks={ALLOWED_BLOCKS}
                />
            </div>
        </section>
    );
}
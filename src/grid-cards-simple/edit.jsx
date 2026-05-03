import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';

const CARD_SIMPLE_TEMPLATE = [
    ['observata/card-simple', { title: 'Search as a Service', description: 'Enable your employees to securely and fast locate information across all internal systems.', iconGeo: '01' }],
    ['observata/card-simple', { title: 'MDR as a Service', description: 'We protect your critical assets 24/7. Detecting threats, responding fast and preventing attacks.', iconGeo: '02' }],
    ['observata/card-simple', { title: 'Observability as a Service', description: 'Powered by Elastic. Managed by experts. Detect early, respond fast.', iconGeo: '03' }],
];

export default function GridCardsSimpleEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-grid-cards-simple-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards Simple" />

            <div className="cards-container">
                <InnerBlocks
                    template={CARD_SIMPLE_TEMPLATE}
                    templateLock={false}
                    allowedBlocks={['observata/card-simple']}
                />
            </div>
        </div>
    );
}
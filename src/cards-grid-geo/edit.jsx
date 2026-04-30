import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const CARD_GEO_LIST_TEMPLATE = [
    ['observata/card-geo-list', { cardTitle: 'Simplified licensing & billing', listItem1: 'Centralise all your observability data into one platform', listItem2: 'Unify logs, metrics, and traces across your entire stack', iconGeo: '01' }],
    ['observata/card-geo-list', { cardTitle: '24/7 Senior expert support', listItem1: 'Transition from legacy tools without migration costs', listItem2: 'As Elastic specialists, we manage your end-to-end move', iconGeo: '02' }],
];

export default function CardsGridGeoEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-cards-grid-geo-editor' });

    return (
        <div {...blockProps}>
            <div className="cards-container">
                <InnerBlocks
                    template={CARD_GEO_LIST_TEMPLATE}
                    templateLock={false}
                    allowedBlocks={['observata/card-geo-list']}
                />
            </div>
        </div>
    );
}
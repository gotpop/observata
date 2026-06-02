import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const CARD_GEO_LIST_TEMPLATE = [
    ['observata/card-geo-list', { cardTitle: 'Simplified licensing & billing', listItem1: 'Centralise all your observability data into one platform', listItem2: 'Unify logs, metrics, and traces across your entire stack', iconGeo: '01' }],
    ['observata/card-geo-list', { cardTitle: '24/7 Senior expert support', listItem1: 'Transition from legacy tools without migration costs', listItem2: 'As Elastic specialists, we manage your end-to-end move', iconGeo: '02' }],
];

export default function GridCardsGeoEdit({ attributes, setAttributes }) {
    const { sectionBgColour } = attributes;
    const blockProps = useBlockProps({ className: 'observata-grid-cards-geo-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards Geo" />
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
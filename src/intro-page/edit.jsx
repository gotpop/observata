import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';

const CARD_TEMPLATE = [
    [
        'observata/card-geo-list',
        {
            cardTitle: 'Unified Data Ingestion',
            listItem1: 'Centralise all your observability data into one platform',
            listItem2: 'Unify logs, metrics, and traces across your entire stack',
            iconGeo: '01',
        },
    ],
    [
        'observata/card-geo-list',
        {
            cardTitle: 'Zero cost elastic migration',
            listItem1: 'Transition from legacy tools without migration costs',
            listItem2: 'As Elastic specialists, we manage your end-to-end move',
            iconGeo: '02',
        },
    ],
];

export default function IntroPageEdit({ attributes, setAttributes }) {
    const { graphic } = attributes;
    const blockProps = useBlockProps({ className: 'block-intro-page' });

    return (
        <section {...blockProps}>
            <BlockLabel name="Intro Page" />
            <div className="intro-page-cards">
                <InnerBlocks
                    template={CARD_TEMPLATE}
                    allowedBlocks={['observata/card-geo-list']}
                    templateLock={false}
                />
            </div>
        </section>
    );
}
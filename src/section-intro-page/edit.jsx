import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

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

export default function SectionIntroPageEdit({ attributes, setAttributes }) {
    const { sectionBgColour, shaderColour = 'blue' } = attributes;

    const blockProps = useBlockProps({ className: 'block-section-intro-page' });

    return (
        <section {...blockProps}>
            <BlockLabel name="Section Intro Page">
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
                <SelectControl
                    label={__('Shader colour', 'observata')}
                    value={shaderColour}
                    options={[
                        { label: __('Blue', 'observata'), value: 'blue' },
                        { label: __('Pink', 'observata'), value: 'pink' },
                        { label: __('Blue Light', 'observata'), value: 'blueLight' },
                    ]}
                    onChange={(val) => setAttributes({ shaderColour: val })}
                />
            </BlockLabel>
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
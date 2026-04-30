import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { TextControl } from '@wordpress/components';

const CARD_GRAPHIC_TEMPLATE = [
    ['observata/card-graphic', { heading: 'Unified observability platform', bodyText: 'Gain complete visibility across your entire infrastructure with real-time monitoring, intelligent alerting, and actionable insights.', graphic: 'ribbon-star', graphicPosition: 'left' }],
    ['observata/card-graphic', { heading: 'Seamless data integration', bodyText: 'Connect every data source effortlessly with our extensive library of pre-built integrations and flexible API architecture.', graphic: 'connected-dots', graphicPosition: 'right' }],
    ['observata/card-graphic', { heading: 'Global scale, zero limits', bodyText: 'Built for enterprise-grade performance with elastic scaling that grows with your needs. No compromises on speed or reliability.', graphic: 'globe-dots', graphicPosition: 'left' }],
];

export default function CardsGridGraphicEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-cards-grid-graphic-editor' });

    return (
        <div {...blockProps}>
            <div className="observata-controls">
                <TextControl
                    label="Section Title"
                    value={attributes.sectionTitle}
                    onChange={(value) => setAttributes({ sectionTitle: value })}
                />
                <TextControl
                    label="Intro Text"
                    value={attributes.introText}
                    onChange={(value) => setAttributes({ introText: value })}
                />
            </div>

            <div className="cards-container">
                <InnerBlocks
                    template={CARD_GRAPHIC_TEMPLATE}
                    templateLock="insert"
                    allowedBlocks={['observata/card-graphic']}
                />
            </div>
        </div>
    );
}
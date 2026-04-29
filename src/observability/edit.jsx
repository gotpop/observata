import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { TextControl } from '@wordpress/components';

const CARD_TEMPLATE = [
    ['observata/card-micro', { cardTitle: 'Alert fatigue', cardDescription: 'Too many noisy alerts hide the incidents that matter most.' }],
    ['observata/card-micro', { cardTitle: 'Cost sprawl', cardDescription: 'Unmanaged ingestion and retention policies inflate platform spend.' }],
    ['observata/card-micro', { cardTitle: 'Blind spots', cardDescription: 'Disconnected logs, metrics, and traces prevent fast root-cause analysis.' }],
];

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-observability-editor' });

    return (
        <div {...blockProps}>
            <div className="observability-section-intro">
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
            </div>

            <article className="card-large">
                <div className="cards-micro">
                    <InnerBlocks
                        template={CARD_TEMPLATE}
                        templateLock="all"
                        allowedBlocks={['observata/card-micro']}
                    />
                </div>
            </article>
        </div>
    );
}
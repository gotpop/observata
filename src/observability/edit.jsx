import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import SectionIntro from '../components/section-intro';

const CARD_TEMPLATE = [
    ['observata/card-micro', { cardTitle: 'Alert fatigue', cardDescription: 'Too many noisy alerts hide the incidents that matter most.' }],
    ['observata/card-micro', { cardTitle: 'Cost sprawl', cardDescription: 'Unmanaged ingestion and retention policies inflate platform spend.' }],
    ['observata/card-micro', { cardTitle: 'Blind spots', cardDescription: 'Disconnected logs, metrics, and traces prevent fast root-cause analysis.' }],
];

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-observability-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Observability" />
            <SectionIntro attributes={attributes} setAttributes={setAttributes} />

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
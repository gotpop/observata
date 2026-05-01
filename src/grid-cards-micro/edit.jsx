import './editor.css';

import { Button, TextControl } from '@wordpress/components';

import BlockLabel from '../components/block-label';
import { useBlockProps } from '@wordpress/block-editor';

const DEFAULT_CARDS = [
    { cardTitle: 'Log analytics', cardDescription: 'Real-time log ingestion, parsing, and correlation across your entire infrastructure.' },
    { cardTitle: 'Infrastructure monitoring', cardDescription: 'Track host, container, and orchestration metrics with intelligent alerting and dashboards.' },
    { cardTitle: 'APM & tracing', cardDescription: 'Distributed tracing and application performance monitoring with OpenTelemetry native support.' },
    { cardTitle: 'Security analytics', cardDescription: 'Detect threats and anomalies with SIEM-powered security analytics and automated response.' },
    { cardTitle: 'Cloud cost optimisation', cardDescription: 'Identify waste and right-size resources across your cloud deployments with actionable recommendations.' },
    { cardTitle: 'Custom integrations', cardDescription: 'Connect any data source with our flexible API and extensive library of pre-built connectors.' },
];

export default function GridCardsMicroEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-grid-cards-micro-editor' });
    const cards = attributes.cards || DEFAULT_CARDS;

    function updateCard(index, field, value) {
        const updated = [...cards];
        updated[index] = { ...updated[index], [field]: value };
        setAttributes({ cards: updated });
    }

    function addCard() {
        setAttributes({ cards: [...cards, { cardTitle: '', cardDescription: '' }] });
    }

    function removeCard(index) {
        const updated = cards.filter((_, i) => i !== index);
        setAttributes({ cards: updated });
    }

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards Micro" />

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
                {cards.map((card, index) => (
                    <div key={index} className="card-micro-editor">
                        <TextControl
                            label={`Card ${index + 1} Title`}
                            value={card.cardTitle}
                            onChange={(value) => updateCard(index, 'cardTitle', value)}
                        />
                        <TextControl
                            label={`Card ${index + 1} Description`}
                            value={card.cardDescription}
                            onChange={(value) => updateCard(index, 'cardDescription', value)}
                        />
                        <Button
                            variant="link"
                            isDestructive
                            onClick={() => removeCard(index)}
                        >
                            Remove Card
                        </Button>
                    </div>
                ))}
                <Button variant="secondary" onClick={addCard}>
                    + Add Card
                </Button>
            </div>
        </div>
    );
}
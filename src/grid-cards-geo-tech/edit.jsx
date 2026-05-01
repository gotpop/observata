import './editor.css';

import { Button, SelectControl, TextControl } from '@wordpress/components';

import BlockLabel from '../components/block-label';
import { useBlockProps } from '@wordpress/block-editor';

const DEFAULT_CARDS = [
    { cardTitle: 'Log analytics', cardText: 'Real-time log ingestion, parsing, and correlation across your entire infrastructure.', iconGeo: '01', backgroundGraphic: '' },
    { cardTitle: 'Infrastructure monitoring', cardText: 'Track host, container, and orchestration metrics with intelligent alerting and dashboards.', iconGeo: '02', backgroundGraphic: '' },
    { cardTitle: 'APM & tracing', cardText: 'Distributed tracing and application performance monitoring with OpenTelemetry native support.', iconGeo: '03', backgroundGraphic: '' },
    { cardTitle: 'Security analytics', cardText: 'Detect threats and anomalies with SIEM-powered security analytics and automated response.', iconGeo: '04', backgroundGraphic: '' },
    { cardTitle: 'Cloud cost optimisation', cardText: 'Identify waste and right-size resources across your cloud deployments with actionable recommendations.', iconGeo: '05', backgroundGraphic: '' },
    { cardTitle: 'Custom integrations', cardText: 'Connect any data source with our flexible API and extensive library of pre-built connectors.', iconGeo: '06', backgroundGraphic: '' },
];

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

const graphicOptions = [
    { label: 'None', value: '' },
    { label: 'Connected Dots', value: 'connected-dots-graphic' },
    { label: 'Donut Plane', value: 'donut-plane-graphic' },
    { label: 'Globe Dots', value: 'globe-dots-graphic' },
    { label: 'Globe Lines', value: 'globe-lines-graphic' },
    { label: 'Infinity Twist', value: 'infinity-twist-graphic' },
    { label: 'Plane Distortion', value: 'plane-distortion-graphic' },
    { label: 'Ribbon Star', value: 'ribbon-star-graphic' },
    { label: 'Ribbon Wave', value: 'ribbon-wave-graphic' },
    { label: 'Sine Flute', value: 'sine-flute-graphic' },
    { label: 'Sine Wave', value: 'sine-wave-graphic' },
    { label: 'Squares Rotating', value: 'squares-rotating-graphic' },
    { label: 'Swooping Lines', value: 'swooping-lines' },
    { label: 'Target', value: 'target-graphic' },
    { label: 'Target Plane', value: 'target-plane-graphic' },
    { label: 'Waveform', value: 'waveform-graphic' },
];

export default function GridCardsGeoTechEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-grid-cards-geo-tech-editor' });
    const cards = attributes.cards || DEFAULT_CARDS;

    function updateCard(index, field, value) {
        const updated = [...cards];
        updated[index] = { ...updated[index], [field]: value };
        setAttributes({ cards: updated });
    }

    function addCard() {
        setAttributes({ cards: [...cards, { cardTitle: '', cardText: '', iconGeo: '01', backgroundGraphic: '' }] });
    }

    function removeCard(index) {
        const updated = cards.filter((_, i) => i !== index);
        setAttributes({ cards: updated });
    }

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards Geo Tech">
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
            </BlockLabel>

            <div className="cards-container">
                {cards.map((card, index) => (
                    <div key={index} className="card-geo-tech-editor">
                        <TextControl
                            label={`Card ${index + 1} Title`}
                            value={card.cardTitle}
                            onChange={(value) => updateCard(index, 'cardTitle', value)}
                        />
                        <TextControl
                            label={`Card ${index + 1} Text`}
                            value={card.cardText}
                            onChange={(value) => updateCard(index, 'cardText', value)}
                        />
                        <SelectControl
                            label={`Card ${index + 1} Geo Icon`}
                            value={card.iconGeo}
                            options={iconOptions}
                            onChange={(value) => updateCard(index, 'iconGeo', value)}
                        />
                        <SelectControl
                            label={`Card ${index + 1} Background Graphic`}
                            value={card.backgroundGraphic}
                            options={graphicOptions}
                            onChange={(value) => updateCard(index, 'backgroundGraphic', value)}
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
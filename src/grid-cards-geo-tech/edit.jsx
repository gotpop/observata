import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';

const CARD_TEMPLATE = [
    ['observata/card-geo-tech', { cardTitle: 'Log analytics', cardText: 'Real-time log ingestion, parsing, and correlation across your entire infrastructure.', iconGeo: '01' }],
    ['observata/card-geo-tech', { cardTitle: 'Infrastructure monitoring', cardText: 'Track host, container, and orchestration metrics with intelligent alerting and dashboards.', iconGeo: '02' }],
    ['observata/card-geo-tech', { cardTitle: 'APM & tracing', cardText: 'Distributed tracing and application performance monitoring with OpenTelemetry native support.', iconGeo: '03' }],
    ['observata/card-geo-tech', { cardTitle: 'Security analytics', cardText: 'Detect threats and anomalies with SIEM-powered security analytics and automated response.', iconGeo: '04' }],
    ['observata/card-geo-tech', { cardTitle: 'Cloud cost optimisation', cardText: 'Identify waste and right-size resources across your cloud deployments with actionable recommendations.', iconGeo: '05' }],
    ['observata/card-geo-tech', { cardTitle: 'Custom integrations', cardText: 'Connect any data source with our flexible API and extensive library of pre-built connectors.', iconGeo: '06' }],
];

export default function GridCardsGeoTechEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-grid-cards-geo-tech-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Grid Cards Geo Tech" />
            <div className="cards-container">
                <InnerBlocks
                    template={CARD_TEMPLATE}
                    allowedBlocks={['observata/card-geo-tech']}
                    templateLock={false}
                />
            </div>
        </div>
    );
}
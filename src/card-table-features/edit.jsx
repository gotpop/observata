import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { TextControl, ToggleControl } from '@wordpress/components';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

const ROW_TEMPLATE = [
    ['observata/plan-features-row', { featureName: 'Elastic licensing', plan1Value: 'check', plan2Value: 'check', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: 'Real-time monitoring', plan1Value: 'check', plan2Value: 'check', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: 'Log aggregation', plan1Value: 'check', plan2Value: 'check', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: 'Custom dashboards', plan1Value: 'check', plan2Value: 'check', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: 'Alerting & notifications', plan1Value: 'dash', plan2Value: 'check', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: 'API access', plan1Value: 'dash', plan2Value: 'check', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: '30-day retention', plan1Value: 'dash', plan2Value: 'check', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: 'Advanced analytics', plan1Value: 'dash', plan2Value: 'check', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: 'Custom integrations', plan1Value: 'dash', plan2Value: 'dash', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: 'Dedicated support', plan1Value: 'dash', plan2Value: 'dash', plan3Value: 'check' }],
    ['observata/plan-features-row', { featureName: 'SLA guarantee', plan1Value: 'dash', plan2Value: 'dash', plan3Value: 'check' }],
];

export default function CardTableFeaturesEdit({ attributes, setAttributes }) {
    const { showPlanCards } = attributes;
    const blockProps = useBlockProps({ className: 'card-table-features-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Card Table Features">
                <ToggleControl
                    label={__('Show Plan Cards', 'observata')}
                    checked={showPlanCards}
                    onChange={(value) => setAttributes({ showPlanCards: value })}
                />
            </BlockLabel>

            {showPlanCards && (
                <div className="card-table-features-editor__cards">
                    <div className="card-table-features-editor__card">
                        <TextControl
                            label={__('Plan 1 Name', 'observata')}
                            value={attributes.plan1Name}
                            onChange={(value) => setAttributes({ plan1Name: value })}
                        />
                        <TextControl
                            label={__('Plan 1 Price', 'observata')}
                            value={attributes.plan1Price}
                            onChange={(value) => setAttributes({ plan1Price: value })}
                        />
                        <TextControl
                            label={__('Plan 1 Description', 'observata')}
                            value={attributes.plan1Description}
                            onChange={(value) => setAttributes({ plan1Description: value })}
                        />
                    </div>
                    <div className="card-table-features-editor__card card-table-features-editor__card--highlighted">
                        <TextControl
                            label={__('Plan 2 Name', 'observata')}
                            value={attributes.plan2Name}
                            onChange={(value) => setAttributes({ plan2Name: value })}
                        />
                        <TextControl
                            label={__('Plan 2 Price', 'observata')}
                            value={attributes.plan2Price}
                            onChange={(value) => setAttributes({ plan2Price: value })}
                        />
                        <TextControl
                            label={__('Plan 2 Description', 'observata')}
                            value={attributes.plan2Description}
                            onChange={(value) => setAttributes({ plan2Description: value })}
                        />
                    </div>
                    <div className="card-table-features-editor__card">
                        <TextControl
                            label={__('Plan 3 Name', 'observata')}
                            value={attributes.plan3Name}
                            onChange={(value) => setAttributes({ plan3Name: value })}
                        />
                        <TextControl
                            label={__('Plan 3 Price', 'observata')}
                            value={attributes.plan3Price}
                            onChange={(value) => setAttributes({ plan3Price: value })}
                        />
                        <TextControl
                            label={__('Plan 3 Description', 'observata')}
                            value={attributes.plan3Description}
                            onChange={(value) => setAttributes({ plan3Description: value })}
                        />
                    </div>
                </div>
            )}

            <div className="card-table-features-editor__rows">
                <strong>{__('Feature Rows (drag to reorder)', 'observata')}</strong>
                <InnerBlocks
                    template={ROW_TEMPLATE}
                    allowedBlocks={['observata/plan-features-row']}
                    templateLock={false}
                />
            </div>
        </div>
    );
}

import './editor.css';

import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, ToggleControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

export default function PlanFeaturesTableEdit({ attributes, setAttributes }) {
    const { showPlanCards } = attributes;
    const blockProps = useBlockProps({ className: 'plan-features-table-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Plan Features Table">
                <ToggleControl
                    label={__('Show Plan Cards', 'observata')}
                    checked={showPlanCards}
                    onChange={(value) => setAttributes({ showPlanCards: value })}
                />
            </BlockLabel>

            {showPlanCards && (
                <div className="plan-features-table-editor__cards">
                    <div className="plan-features-table-editor__card">
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
                    <div className="plan-features-table-editor__card plan-features-table-editor__card--highlighted">
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
                    <div className="plan-features-table-editor__card">
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

        </div>
    );
}
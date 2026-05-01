import { SelectControl, TextControl } from '@wordpress/components';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

const VALUE_OPTIONS = [
    { label: __('✓ Check', 'observata'), value: 'check' },
    { label: __('— Dash', 'observata'), value: 'dash' },
];

export default function PlanFeaturesRowEdit({ attributes, setAttributes }) {
    const { featureName, plan1Value, plan2Value, plan3Value } = attributes;
    const blockProps = useBlockProps({ className: 'plan-features-row-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Feature Row" />

            <div className="plan-features-row-editor__controls">
                <TextControl
                    label={__('Feature Name', 'observata')}
                    value={featureName}
                    onChange={(val) => setAttributes({ featureName: val })}
                    placeholder={__('e.g. Log retention', 'observata')}
                />

                <div className="plan-features-row-editor__selects">
                    <SelectControl
                        label={__('Plan 1', 'observata')}
                        value={plan1Value}
                        options={VALUE_OPTIONS}
                        onChange={(val) => setAttributes({ plan1Value: val })}
                    />
                    <SelectControl
                        label={__('Plan 2', 'observata')}
                        value={plan2Value}
                        options={VALUE_OPTIONS}
                        onChange={(val) => setAttributes({ plan2Value: val })}
                    />
                    <SelectControl
                        label={__('Plan 3', 'observata')}
                        value={plan3Value}
                        options={VALUE_OPTIONS}
                        onChange={(val) => setAttributes({ plan3Value: val })}
                    />
                </div>
            </div>
        </div>
    );
}
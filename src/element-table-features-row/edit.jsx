import { SelectControl, TextControl } from '@wordpress/components';

import BlockLabel from '../components/block-label';
import ControlsLayout from '../components/controls-layout';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

const VALUE_OPTIONS = [
    { label: __('✓ Check', 'observata'), value: 'check' },
    { label: __('— Dash', 'observata'), value: 'dash' },
];

export default function ElementTableFeaturesRowEdit({ attributes, setAttributes }) {
    const { featureName, plan1Value, plan2Value, plan3Value } = attributes;
    const blockProps = useBlockProps({ className: 'element-table-features-row-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Feature Row" />
            <ControlsLayout columns={4} gap="1rem">
                <TextControl
                    label={__('Feature Name', 'observata')}
                    value={featureName}
                    onChange={(val) => setAttributes({ featureName: val })}
                    placeholder={__('e.g. Log retention', 'observata')}
                />
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
                    onChange={(val) => setAttributes({ plan3Value: val })} />
            </ControlsLayout>
        </div>
    );
}

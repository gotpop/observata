import { Button, TextControl, ToggleControl } from '@wordpress/components';
import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

export default function PlanEdit({ attributes, setAttributes }) {
    const {
        planName,
        planPrice,
        planPricePeriod,
        planDescription,
        planFeatures,
        ctaText,
        ctaUrl,
        isHighlighted,
    } = attributes;

    const blockProps = useBlockProps({ className: `plan-card${isHighlighted ? ' plan-card--highlighted' : ''}` });
    const features = planFeatures || [];

    function updateFeature(index, value) {
        const updated = [...features];
        updated[index] = value;
        setAttributes({ planFeatures: updated });
    }

    function addFeature() {
        setAttributes({ planFeatures: [...features, ''] });
    }

    function removeFeature(index) {
        const updated = features.filter((_, i) => i !== index);
        setAttributes({ planFeatures: updated });
    }

    return (
        <article {...blockProps}>
            <BlockLabel name="Plan Card" />

            <div className="plan-card-header">
                <RichText
                    tagName="h3"
                    className="plan-card-name"
                    value={planName}
                    onChange={(val) => setAttributes({ planName: val })}
                    placeholder={__('Plan name…', 'observata')}
                    disableLineBreaks
                />
                <ToggleControl
                    label={__('Highlighted', 'observata')}
                    checked={isHighlighted}
                    onChange={(val) => setAttributes({ isHighlighted: val })}
                />
            </div>

            <div className="plan-card-pricing">
                <TextControl
                    label={__('Price', 'observata')}
                    value={planPrice}
                    onChange={(val) => setAttributes({ planPrice: val })}
                />
                <TextControl
                    label={__('Period', 'observata')}
                    value={planPricePeriod}
                    onChange={(val) => setAttributes({ planPricePeriod: val })}
                />
            </div>

            <RichText
                tagName="p"
                className="plan-card-description"
                value={planDescription}
                onChange={(val) => setAttributes({ planDescription: val })}
                placeholder={__('Plan description…', 'observata')}
                disableLineBreaks
            />

            <div className="plan-card-features-editor">
                <strong>{__('Features', 'observata')}</strong>
                {features.map((feature, index) => (
                    <div key={index} className="plan-feature-row">
                        <TextControl
                            value={feature}
                            onChange={(val) => updateFeature(index, val)}
                            placeholder={__('Feature…', 'observata')}
                        />
                        <Button
                            variant="link"
                            isDestructive
                            onClick={() => removeFeature(index)}
                        >
                            {__('Remove', 'observata')}
                        </Button>
                    </div>
                ))}
                <Button variant="secondary" onClick={addFeature}>
                    + {__('Add Feature', 'observata')}
                </Button>
            </div>

            <div className="plan-card-cta-editor">
                <TextControl
                    label={__('CTA Text', 'observata')}
                    value={ctaText}
                    onChange={(val) => setAttributes({ ctaText: val })}
                />
                <TextControl
                    label={__('CTA URL', 'observata')}
                    value={ctaUrl}
                    onChange={(val) => setAttributes({ ctaUrl: val })}
                />
            </div>
        </article>
    );
}
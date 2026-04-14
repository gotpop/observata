import { RichText, useBlockProps } from '@wordpress/block-editor';
import { SelectControl, TextControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export default function CalloutEdit({ attributes, setAttributes }) {
    const { text, variant, ctaText, ctaUrl } = attributes;
    const blockProps = useBlockProps({
        className: `wp-block-observata-callout is-${variant}`,
    });

    return (
        <aside {...blockProps}>
            <div className="callout-inner">
                <SelectControl
                    label={__('Variant', 'observata')}
                    value={variant}
                    options={[
                        { label: __('Info', 'observata'), value: 'info' },
                        { label: __('Warning', 'observata'), value: 'warning' },
                        { label: __('Success', 'observata'), value: 'success' },
                    ]}
                    onChange={(val) => setAttributes({ variant: val })}
                />
                <RichText
                    tagName="p"
                    className="callout-text"
                    value={text}
                    onChange={(val) => setAttributes({ text: val })}
                    placeholder={__('Callout message…', 'observata')}
                />
                <TextControl
                    label={__('CTA Text (optional)', 'observata')}
                    value={ctaText}
                    onChange={(val) => setAttributes({ ctaText: val })}
                />
                <TextControl
                    label={__('CTA URL (optional)', 'observata')}
                    value={ctaUrl}
                    onChange={(val) => setAttributes({ ctaUrl: val })}
                />
            </div>
        </aside>
    );
}

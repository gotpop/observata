import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-observability-editor' });

    return (
        <div {...blockProps}>
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
        </div>
    );
}

import './editor.css';

import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const CONTENT_ALLOWED_BLOCKS = ['observata/element-body-md', 'observata/element-list-simple'];

export default function CardTextSimpleEdit({ attributes, setAttributes }) {
    const { heading, spanColumns } = attributes;
    const blockProps = useBlockProps({
        className: 'card-text-simple',
        'data-span-columns': spanColumns,
    });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Text Simple" />
            <SelectControl
                label={__('Span Columns', 'observata')}
                value={spanColumns}
                options={[
                    { label: __('Span 1', 'observata'), value: '1' },
                    { label: __('Span 2', 'observata'), value: '2' },
                    { label: __('Span 3', 'observata'), value: '3' },
                ]}
                onChange={(val) => setAttributes({ spanColumns: val })}
            />
            <div className="card-body">
                <RichText
                    tagName="h2"
                    className="heading-md"
                    value={heading}
                    onChange={(val) => setAttributes({ heading: val })}
                    placeholder={__('Card heading…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <InnerBlocks
                    allowedBlocks={CONTENT_ALLOWED_BLOCKS}
                    template={[['observata/element-body-md', {}]]}
                    templateLock={false}
                />
            </div>
        </article>
    );
}

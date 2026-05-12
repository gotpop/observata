import './editor.css';

import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const CONTENT_ALLOWED_BLOCKS = ['observata/body-md'];

export default function CardTextSimpleEdit({ attributes, setAttributes }) {
    const { heading } = attributes;
    const blockProps = useBlockProps({ className: 'card-text-simple' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Text Simple" />
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
                    template={[['observata/body-md', {}]]}
                    templateLock={false}
                />
            </div>
        </article>
    );
}

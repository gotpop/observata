import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function BodyMdEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'body-md' });

    return (
        <div {...blockProps}>
            <RichText
                value={attributes.content}
                onChange={(val) => setAttributes({ content: val })}
                placeholder={'Add content…'}
                allowedFormats={['core/bold', 'core/link']}
                className='body-md__content'
            />
        </div>
    );
}

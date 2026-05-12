import { RichText } from '@wordpress/block-editor';

export default function BodyMdEdit({ attributes, setAttributes }) {
    return (
        <RichText
            value={attributes.content}
            onChange={(val) => setAttributes({ content: val })}
            placeholder={'Add content…'}
            allowedFormats={[]}
            className='body-md'
        />
    );
}

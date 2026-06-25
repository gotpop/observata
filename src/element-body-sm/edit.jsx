import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function BodySmEdit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: 'body-sm' });

	return (
		<div {...blockProps}>
			<RichText
				value={attributes.content}
				onChange={(val) => setAttributes({ content: val })}
				placeholder={'Add content…'}
				allowedFormats={[]}
				className="body-sm__content"
			/>
		</div>
	);
}

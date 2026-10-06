import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

export default function CardContactFormEdit({ attributes, setAttributes }) {
	const { formUrl } = attributes;
	const blockProps = useBlockProps({ className: 'contact-form-editor' });

	const formUrlControl = (
		<TextControl
			label={__('Form URL', 'observata')}
			type="url"
			value={formUrl}
			onChange={(value) => setAttributes({ formUrl: value })}
			help={__('Zoho form embed URL. Leave blank to hide the form.', 'observata')}
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Contact Form Settings', 'observata')}>
					{formUrlControl}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<BlockLabel name="Card Contact Form">{formUrlControl}</BlockLabel>
				<div className="contact-form">
					<div className="contact-form__placeholder">
						<span className="contact-form__placeholder-icon">📝</span>
						<p className="contact-form__placeholder-text">
							Zoho Contact Form — preview not available in editor
						</p>
						{formUrl && (
							<p className="contact-form__placeholder-url">
								<a href={formUrl} target="_blank" rel="noreferrer">
									{formUrl}
								</a>
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

import { useBlockProps } from '@wordpress/block-editor';
import BlockLabel from '../components/block-label';

export default function ContactFormEdit({ attributes }) {
    const blockProps = useBlockProps({ className: 'contact-form-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Contact Form" />
            <div className="contact-form">
                <div className="contact-form__placeholder">
                    <span className="contact-form__placeholder-icon">📝</span>
                    <p className="contact-form__placeholder-text">
                        Zoho Contact Form — preview not available in editor
                    </p>
                </div>
            </div>
        </div>
    );
}
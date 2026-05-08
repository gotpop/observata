import { RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

export default function ContactDetailsEdit({ attributes, setAttributes }) {
    const { phone, email, address } = attributes;
    const blockProps = useBlockProps({ className: 'contact-details-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Contact Details" />
            <div className="contact-details">
                <div className="contact-details__item">
                    <span className="contact-details__label">Phone</span>
                    <RichText
                        tagName="a"
                        className="contact-details__value"
                        value={phone}
                        onChange={(val) => setAttributes({ phone: val })}
                        placeholder={__('Phone number…', 'observata')}
                        disableLineBreaks
                    />
                </div>
                <div className="contact-details__item">
                    <span className="contact-details__label">Email</span>
                    <RichText
                        tagName="a"
                        className="contact-details__value"
                        value={email}
                        onChange={(val) => setAttributes({ email: val })}
                        placeholder={__('Email address…', 'observata')}
                        disableLineBreaks
                    />
                </div>
                <div className="contact-details__item">
                    <span className="contact-details__label">Address</span>
                    <RichText
                        tagName="span"
                        className="contact-details__value"
                        value={address}
                        onChange={(val) => setAttributes({ address: val })}
                        placeholder={__('Address…', 'observata')}
                        disableLineBreaks
                    />
                </div>
            </div>
        </div>
    );
}
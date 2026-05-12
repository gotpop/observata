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
                <div className="item">
                    <span className="label">Phone</span>
                    <RichText
                        tagName="a"
                        className="value"
                        value={phone}
                        onChange={(val) => setAttributes({ phone: val })}
                        placeholder={__('Phone number…', 'observata')}
                        disableLineBreaks
                        allowedFormats={[]}
                    />
                </div>
                <div className="item">
                    <span className="label">Email</span>
                    <RichText
                        tagName="a"
                        className="value"
                        value={email}
                        onChange={(val) => setAttributes({ email: val })}
                        placeholder={__('Email address…', 'observata')}
                        disableLineBreaks
                        allowedFormats={[]}
                    />
                </div>
                <div className="item">
                    <span className="label">Address</span>
                    <RichText
                        tagName="span"
                        className="value"
                        value={address}
                        onChange={(val) => setAttributes({ address: val })}
                        placeholder={__('Address…', 'observata')}
                        disableLineBreaks
                        allowedFormats={[]}
                    />
                </div>
            </div>
        </div>
    );
}
import { MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';
import { TextControl, TextareaControl } from '@wordpress/components';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

export default function CardTeamMemberEdit({ attributes, setAttributes }) {
    const { name, role, bio, imageUrl, imageAlt, linkedinUrl, twitterUrl } = attributes;
    const blockProps = useBlockProps({ className: 'card-team-member-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Team Member" />

            <div className="card-team-member-editor__photo">
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={(media) => setAttributes({
                            imageUrl: media.url,
                            imageAlt: media.alt || '',
                        })}
                        allowedTypes={['image']}
                        value={imageUrl}
                        render={({ open }) => (
                            <button onClick={open} className="card-team-member-editor__upload-btn">
                                {imageUrl ? (
                                    <img src={imageUrl} alt={imageAlt} />
                                ) : (
                                    <span>{__('Upload Photo', 'observata')}</span>
                                )}
                            </button>
                        )}
                    />
                </MediaUploadCheck>
            </div>

            <div className="card-team-member-editor__controls">
                <TextControl
                    label={__('Name', 'observata')}
                    value={name}
                    onChange={(val) => setAttributes({ name: val })}
                    placeholder={__('Full name', 'observata')}
                />
                <TextControl
                    label={__('Role', 'observata')}
                    value={role}
                    onChange={(val) => setAttributes({ role: val })}
                    placeholder={__('Job title', 'observata')}
                />
                <TextareaControl
                    label={__('Bio', 'observata')}
                    value={bio}
                    onChange={(val) => setAttributes({ bio: val })}
                    placeholder={__('Short biography…', 'observata')}
                    rows={3}
                />
                <div className="card-team-member-editor__social">
                    <TextControl
                        label={__('LinkedIn URL', 'observata')}
                        value={linkedinUrl}
                        onChange={(val) => setAttributes({ linkedinUrl: val })}
                        placeholder="https://linkedin.com/in/…"
                    />
                    <TextControl
                        label={__('Twitter URL', 'observata')}
                        value={twitterUrl}
                        onChange={(val) => setAttributes({ twitterUrl: val })}
                        placeholder="https://twitter.com/…"
                    />
                </div>
            </div>
        </div>
    );
}
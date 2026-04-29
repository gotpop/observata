import { MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export default function HeroEdit({ attributes, setAttributes }) {
    const { heading, subheading, mediaUrl, mediaId, ctaText, ctaUrl } = attributes;
    const blockProps = useBlockProps({
        className: 'block-hero-home',
        style: mediaUrl ? { backgroundImage: `url(${mediaUrl})` } : {},
    });

    return (
        <section {...blockProps}>
            <div className="hero-inner john">
                <RichText
                    tagName="h1"
                    value={heading}
                    onChange={(val) => setAttributes({ heading: val })}
                    placeholder={__('Hero heading…', 'observata')}
                />
                <RichText
                    tagName="p"
                    className="hero-subheading"
                    value={subheading}
                    onChange={(val) => setAttributes({ subheading: val })}
                    placeholder={__('Subheading…', 'observata')}
                />
                <div className="hero-cta-fields">
                    <TextControl
                        label={__('CTA Text', 'observata')}
                        value={ctaText}
                        onChange={(val) => setAttributes({ ctaText: val })}
                    />
                    <TextControl
                        label={__('CTA URL', 'observata')}
                        value={ctaUrl}
                        onChange={(val) => setAttributes({ ctaUrl: val })}
                    />
                </div>
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={(media) =>
                            setAttributes({ mediaUrl: media.url, mediaId: media.id })
                        }
                        allowedTypes={['image']}
                        value={mediaId}
                        render={({ open }) => (
                            <div className="hero-media-controls">
                                {mediaUrl && (
                                    <>
                                        <img src={mediaUrl} alt="" className="hero-bg-preview" />
                                        <Button
                                            isDestructive
                                            variant="secondary"
                                            onClick={() =>
                                                setAttributes({ mediaUrl: '', mediaId: 0 })
                                            }
                                        >
                                            {__('Remove background image', 'observata')}
                                        </Button>
                                    </>
                                )}
                                <Button variant="secondary" onClick={open}>
                                    {mediaUrl
                                        ? __('Replace background image', 'observata')
                                        : __('Set background image', 'observata')}
                                </Button>
                            </div>
                        )}
                    />
                </MediaUploadCheck>
            </div>
        </section>
    );
}

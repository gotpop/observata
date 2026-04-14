import { Button, TextControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

export default function CardEdit({ attributes, setAttributes }) {
    const { mediaUrl, mediaId, cardTitle, cardText, linkUrl, linkText } = attributes;
    const blockProps = useBlockProps({ className: 'wp-block-observata-card' });

    return (
        <article {...blockProps}>
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={(media) =>
                        setAttributes({ mediaUrl: media.url, mediaId: media.id })
                    }
                    allowedTypes={['image']}
                    value={mediaId}
                    render={({ open }) => (
                        <div className="card-image-area">
                            {mediaUrl ? (
                                <>
                                    <img src={mediaUrl} alt="" className="card-image" />
                                    <Button
                                        isDestructive
                                        variant="secondary"
                                        className="card-remove-image"
                                        onClick={() =>
                                            setAttributes({ mediaUrl: '', mediaId: 0 })
                                        }
                                    >
                                        {__('Remove', 'observata')}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="secondary"
                                    className="card-add-image"
                                    onClick={open}
                                >
                                    {__('Add card image', 'observata')}
                                </Button>
                            )}
                            {mediaUrl && (
                                <Button variant="link" onClick={open}>
                                    {__('Replace', 'observata')}
                                </Button>
                            )}
                        </div>
                    )}
                />
            </MediaUploadCheck>
            <div className="card-body">
                <RichText
                    tagName="h3"
                    value={cardTitle}
                    onChange={(val) => setAttributes({ cardTitle: val })}
                    placeholder={__('Card title…', 'observata')}
                />
                <RichText
                    tagName="p"
                    className="card-text"
                    value={cardText}
                    onChange={(val) => setAttributes({ cardText: val })}
                    placeholder={__('Card description…', 'observata')}
                />
                <TextControl
                    label={__('Link URL', 'observata')}
                    value={linkUrl}
                    onChange={(val) => setAttributes({ linkUrl: val })}
                />
                <TextControl
                    label={__('Link text', 'observata')}
                    value={linkText}
                    onChange={(val) => setAttributes({ linkText: val })}
                />
            </div>
        </article>
    );
}

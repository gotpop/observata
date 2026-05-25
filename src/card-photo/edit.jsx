import { InnerBlocks, MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';

const CONTENT_ALLOWED_BLOCKS = ['observata/body-md'];

export default function CardPhotoEdit({ attributes, setAttributes }) {
    const { title, imageUrl, imageAlt } = attributes;
    const blockProps = useBlockProps({ className: 'card-photo' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Photo" />

            <div className="card-photo-editor__image">
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={(media) => setAttributes({
                            imageId: media.id,
                            imageUrl: media.url,
                            imageAlt: media.alt || '',
                        })}
                        allowedTypes={['image']}
                        value={attributes.imageId || imageUrl}
                        render={({ open }) => (
                            <button onClick={open} className="card-photo-editor__upload-btn">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={imageAlt}
                                        style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                                    />
                                ) : (
                                    <span>{__('Upload Image', 'observata')}</span>
                                )}
                            </button>
                        )}
                    />
                </MediaUploadCheck>
            </div>

            <div className="card-photo-editor__controls">
                <RichText
                    tagName="h3"
                    className="card-photo-editor__title"
                    value={title}
                    onChange={(val) => setAttributes({ title: val })}
                    placeholder={__('Card title…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <InnerBlocks
                    allowedBlocks={CONTENT_ALLOWED_BLOCKS}
                    template={[['observata/body-md', {}]]}
                    templateLock={false}
                />
            </div>
        </article>
    );
}
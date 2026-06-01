import './editor.css';

import { InnerBlocks, MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { Button } from '@wordpress/components';
import UnsplashImagePicker from '../components/unsplash-image-picker';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

const CONTENT_ALLOWED_BLOCKS = ['observata/element-body-sm'];

export default function CardPhotoEdit({ attributes, setAttributes }) {
    const { title, imageUrl, imageAlt } = attributes;
    const [showUnsplashPicker, setShowUnsplashPicker] = useState(false);
    const blockProps = useBlockProps({ className: 'card-photo' });

    const handleUnsplashSelect = (imageData) => {
        setAttributes({
            imageId: imageData.id,
            imageUrl: imageData.url,
            imageAlt: imageData.alt,
            unsplashPhotographer: imageData.photographer,
            unsplashSourceUrl: imageData.sourceUrl,
        });
        setShowUnsplashPicker(false);
    };

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Photo" />

            <div className="card-photo-editor__image">
                <div className="card-photo-editor__image-buttons">
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
                                <Button onClick={open} className="card-photo-editor__upload-btn">
                                    {__('Media Library', 'observata')}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                    <Button
                        onClick={() => setShowUnsplashPicker(true)}
                        isSecondary
                        className="card-photo-editor__unsplash-btn"
                    >
                        {__('Search Unsplash', 'observata')}
                    </Button>
                </div>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={imageAlt}
                        style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                    />
                )}
                <UnsplashImagePicker
                    isOpen={showUnsplashPicker}
                    onClose={() => setShowUnsplashPicker(false)}
                    onSelect={handleUnsplashSelect}
                />
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
                    template={[['observata/element-body-sm', {}]]}
                    templateLock={false}
                    orientation="vertical"
                    renderAppender={InnerBlocks.ButtonBlockAppender}
                />
            </div>
        </article>
    );
}
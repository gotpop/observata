import './editor.css';

import { useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import UnsplashImagePicker from '../components/unsplash-image-picker';

export default function CardImageUnsplashEdit({ attributes, setAttributes }) {
    const { imageUrl, imageAlt } = attributes;
    const [showUnsplashPicker, setShowUnsplashPicker] = useState(false);
    const blockProps = useBlockProps({ className: 'card-image-unsplash' });

    const handleUnsplashSelect = (imageData) => {
        setAttributes({
            imageUrl: imageData.url,
            imageAlt: imageData.alt || '',
            unsplashPhotographer: imageData.photographer || '',
            unsplashSourceUrl: imageData.sourceUrl || '',
        });
        setShowUnsplashPicker(false);
    };

    return (
        <>
            <figure {...blockProps}>
                <BlockLabel name="Card Image Unsplash" />

                <div className="card-image-unsplash-editor__preview">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="card-image-unsplash-editor__img"
                        />
                    ) : (
                        <div className="card-image-unsplash-editor__placeholder">
                            <span>{__('No image selected', 'observata')}</span>
                        </div>
                    )}

                    <div className="card-image-unsplash-editor__actions">
                        <Button
                            onClick={() => setShowUnsplashPicker(true)}
                            variant="primary"
                        >
                            {imageUrl ? __('Change Image', 'observata') : __('Select from Unsplash', 'observata')}
                        </Button>

                        {imageUrl && (
                            <Button
                                onClick={() => setAttributes({
                                    imageUrl: '',
                                    imageAlt: '',
                                    unsplashPhotographer: '',
                                    unsplashSourceUrl: '',
                                })}
                                variant="secondary"
                                isDestructive
                            >
                                {__('Remove', 'observata')}
                            </Button>
                        )}
                    </div>
                </div>

                {showUnsplashPicker && (
                    <UnsplashImagePicker
                        isOpen={showUnsplashPicker}
                        onClose={() => setShowUnsplashPicker(false)}
                        onSelect={handleUnsplashSelect}
                    />
                )}
            </figure>
        </>
    );
}
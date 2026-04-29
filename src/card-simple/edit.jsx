import { MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
    const { imageUrl, imageAlt, title, description } = attributes;
    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Image Settings', 'observata')}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={(media) => setAttributes({ imageUrl: media.url, imageAlt: media.alt })}
                            allowedTypes={['image']}
                            render={({ open }) => (
                                <Button variant="secondary" onClick={open}>
                                    {imageUrl ? __('Replace Image', 'observata') : __('Select Image', 'observata')}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                    {imageUrl && (
                        <Button
                            variant="link"
                            isDestructive
                            onClick={() => setAttributes({ imageUrl: '', imageAlt: '' })}
                        >
                            {__('Remove Image', 'observata')}
                        </Button>
                    )}
                    <TextControl
                        label={__('Image Alt Text', 'observata')}
                        value={imageAlt}
                        onChange={(val) => setAttributes({ imageAlt: val })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="card-simple">
                    {imageUrl && (
                        <img className="card-simple__image" src={imageUrl} alt={imageAlt} />
                    )}
                    <RichText
                        tagName="h3"
                        className="card-simple__title"
                        value={title}
                        onChange={(val) => setAttributes({ title: val })}
                        placeholder={__('Card title…', 'observata')}
                    />
                    <RichText
                        tagName="p"
                        className="card-simple__description"
                        value={description}
                        onChange={(val) => setAttributes({ description: val })}
                        placeholder={__('Card description…', 'observata')}
                    />
                </div>
            </div>
        </>
    );
}
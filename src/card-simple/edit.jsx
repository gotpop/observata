import './editor.css';

import { MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl, TextControl } from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

export default function Edit({ attributes, setAttributes }) {
    const { imageUrl, imageAlt, title, description, iconGeo } = attributes;
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
                <PanelBody title={__('Icon Settings', 'observata')}>
                    <SelectControl
                        label={__('Geo Icon', 'observata')}
                        value={iconGeo}
                        options={[{ label: __('None', 'observata'), value: '' }, ...iconOptions]}
                        onChange={(val) => setAttributes({ iconGeo: val })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <BlockLabel name="Card Simple" />

                <div className="card-simple">
                    {iconGeo && (
                        <div className="card-simple__icon is-placeholder">
                            <span className="icon-geo">{iconGeo}</span>
                        </div>
                    )}
                    {!iconGeo && imageUrl && (
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
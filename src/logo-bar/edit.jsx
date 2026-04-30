import { MediaUpload, useBlockProps } from '@wordpress/block-editor';

import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const LOGO_COUNT = 4;

export default function LogoBarEdit({ attributes, setAttributes }) {
    const { logos } = attributes;
    const blockProps = useBlockProps({ className: 'logo-bar' });

    const logosArray = Array.isArray(logos) ? logos : [];
    const paddedLogos = [...logosArray];
    while (paddedLogos.length < LOGO_COUNT) {
        paddedLogos.push({ src: '', alt: '' });
    }

    const updateLogo = (index, value) => {
        const updated = [...paddedLogos];
        updated[index] = { ...updated[index], ...value };
        setAttributes({ logos: updated });
    };

    const removeLogo = (index) => {
        const updated = [...paddedLogos];
        updated[index] = { src: '', alt: '' };
        setAttributes({ logos: updated });
    };

    return (
        <div {...blockProps}>
            {paddedLogos.map((logo, index) => (
                <div key={index} className="logo-bar__item">
                    {logo.src ? (
                        <div className="logo-bar__preview">
                            <img
                                src={logo.src}
                                alt={logo.alt || ''}
                            />
                            <Button
                                variant="link"
                                isDestructive
                                onClick={() => removeLogo(index)}
                            >
                                {__('Remove', 'observata')}
                            </Button>
                        </div>
                    ) : (
                        <MediaUpload
                            onSelect={(media) =>
                                updateLogo(index, {
                                    src: media.url,
                                    alt: media.alt || media.title || '',
                                })
                            }
                            allowedTypes={['image']}
                            render={({ open }) => (
                                <Button variant="secondary" onClick={open}>
                                    {__('Select Logo', 'observata')}
                                </Button>
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
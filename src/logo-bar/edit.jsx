import { MediaUpload, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const LOGO_COUNT = 4;

const DEFAULT_LOGOS = [
    { src: '', alt: 'AF', file: 'af-logo.svg' },
    { src: '', alt: 'Tele Dark', file: 'tele-dark-logo.svg' },
    { src: '', alt: 'Elastic', file: 'elastic-logo.svg' },
    { src: '', alt: 'Crowdstrike', file: 'crowdstrike-logo.svg' },
];

function getTemplateUrl() {
    return window.observata?.templateUrl || '';
}

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

    const getLogoSrc = (logo, index) => {
        if (logo.src) {
            return logo.src;
        }
        const fallback = DEFAULT_LOGOS[index];
        if (fallback) {
            return `${getTemplateUrl()}/assets/svg/logos/bar/${fallback.file}`;
        }
        return '';
    };

    const getLogoAlt = (logo, index) => {
        if (logo.alt) {
            return logo.alt;
        }
        const fallback = DEFAULT_LOGOS[index];
        return fallback ? fallback.alt : '';
    };

    return (
        <div {...blockProps}>
            <BlockLabel name="Logo Bar" />
            <div className="block-content">
                {paddedLogos.map((logo, index) => {
                    const src = getLogoSrc(logo, index);
                    const alt = getLogoAlt(logo, index);
                    const isCustom = !!logo.src;

                    return (
                        <div key={index} className="logo-bar__item">
                            {src && (
                                <div className="logo-bar__preview">
                                    <img
                                        src={src}
                                        alt={alt}
                                        className={isCustom ? 'is-custom' : 'is-default'}
                                    />
                                    <div className="logo-bar__actions">
                                        <MediaUpload
                                            onSelect={(media) =>
                                                updateLogo(index, {
                                                    src: media.url,
                                                    alt: media.alt || media.title || '',
                                                })
                                            }
                                            allowedTypes={['image']}
                                            render={({ open }) => (
                                                <Button variant="link" onClick={open}>
                                                    {__('Replace', 'observata')}
                                                </Button>
                                            )}
                                        />
                                        {isCustom && (
                                            <Button
                                                variant="link"
                                                isDestructive
                                                onClick={() => removeLogo(index)}
                                            >
                                                {__('Remove', 'observata')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                            {!src && (
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
                    );
                })}
            </div>
        </div>
    );
}
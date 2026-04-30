import { RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const GEO_OPTIONS = [
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
];

export default function IntroPageEdit({ attributes, setAttributes }) {
    const {
        heading,
        cardOneTitle,
        cardOneText,
        cardOneIcon,
        cardTwoTitle,
        cardTwoText,
        cardTwoIcon,
        graphic,
    } = attributes;
    const blockProps = useBlockProps({ className: 'block-intro-page' });
    const tplUrl = window.observata?.templateUrl || '';

    return (
        <section {...blockProps}>
            <div className="intro-page-graphic">
                <img
                    src={`${tplUrl}/assets/svg/graphics/${graphic}-graphic.svg`}
                    alt={`${graphic} graphic`}
                />
            </div>
            <div className="intro-page-content">
                <RichText
                    tagName="h2"
                    className="intro-page-heading"
                    value={heading}
                    onChange={(val) => setAttributes({ heading: val })}
                    placeholder={__('Section heading…', 'observata')}
                />
                <div className="intro-page-cards">
                    <article className="intro-page-card">
                        <div className="intro-page-card-icon">
                            <img
                                src={`${tplUrl}/assets/svg/geo/${cardOneIcon}-icon-geo.svg`}
                                alt=""
                            />
                        </div>
                        <div className="intro-page-card-body">
                            <RichText
                                tagName="h3"
                                className="intro-page-card-title"
                                value={cardOneTitle}
                                onChange={(val) => setAttributes({ cardOneTitle: val })}
                                placeholder={__('Card 1 title…', 'observata')}
                            />
                            <RichText
                                tagName="p"
                                className="intro-page-card-text"
                                value={cardOneText}
                                onChange={(val) => setAttributes({ cardOneText: val })}
                                placeholder={__('Card 1 text…', 'observata')}
                            />
                        </div>
                        <SelectControl
                            label={__('Card 1 Icon', 'observata')}
                            value={cardOneIcon}
                            options={GEO_OPTIONS}
                            onChange={(val) => setAttributes({ cardOneIcon: val })}
                        />
                    </article>
                    <article className="intro-page-card">
                        <div className="intro-page-card-icon">
                            <img
                                src={`${tplUrl}/assets/svg/geo/${cardTwoIcon}-icon-geo.svg`}
                                alt=""
                            />
                        </div>
                        <div className="intro-page-card-body">
                            <RichText
                                tagName="h3"
                                className="intro-page-card-title"
                                value={cardTwoTitle}
                                onChange={(val) => setAttributes({ cardTwoTitle: val })}
                                placeholder={__('Card 2 title…', 'observata')}
                            />
                            <RichText
                                tagName="p"
                                className="intro-page-card-text"
                                value={cardTwoText}
                                onChange={(val) => setAttributes({ cardTwoText: val })}
                                placeholder={__('Card 2 text…', 'observata')}
                            />
                        </div>
                        <SelectControl
                            label={__('Card 2 Icon', 'observata')}
                            value={cardTwoIcon}
                            options={GEO_OPTIONS}
                            onChange={(val) => setAttributes({ cardTwoIcon: val })}
                        />
                    </article>
                </div>
            </div>
        </section>
    );
}
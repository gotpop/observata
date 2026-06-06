import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import ControlsLayout from '../components/controls-layout';
import SectionIntro from '../components/section-intro';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes }) {
    const {
        sectionBgColour,
        ctaText,
        ctaUrl,
        phase1Title,
        phase1ItemTitle1,
        phase1Text1,
        phase1ItemTitle2,
        phase1Text2,
        phase2Title,
        phase2ItemTitle1,
        phase2Text1,
    } = attributes;

    const blockProps = useBlockProps({ className: 'block-section-partnership' });

    // Fetch internal pages for dropdown
    const pages = useSelect(select => {
        const { getEntityRecords } = select('core');
        return getEntityRecords('postType', 'page', { per_page: 100, _fields: 'id,title,link' });
    }, []);

    const pageOptions = [
        { label: __('Select a page...', 'observata'), value: '' },
        ...(pages || []).map(page => ({
            label: page.title?.rendered || `Page ${page.id}`,
            value: page.link
        }))
    ];

    return (
        <section {...blockProps}>
            <BlockLabel name="Section Partnership">
                <SelectControl
                    label={__('Section Background', 'observata')}
                    value={sectionBgColour}
                    options={[
                        { label: __('White', 'observata'), value: 'white' },
                        { label: __('Grey', 'observata'), value: 'grey' },
                        { label: __('Gradient', 'observata'), value: 'gradient' },
                    ]}
                    onChange={(val) => setAttributes({ sectionBgColour: val })}
                />
            </BlockLabel>
            <ControlsLayout columns={1} gap="1rem">
                <SectionIntro attributes={attributes} setAttributes={setAttributes} />
                <ControlsLayout columns={2} gap="1rem">
                    <ControlsLayout columns={1} gap="0rem">
                        <RichText
                            tagName="h3"
                            className="phase-title"
                            value={phase1Title}
                            onChange={(val) => setAttributes({ phase1Title: val })}
                            placeholder={__('Phase title…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                        <RichText
                            tagName="h4"
                            className="phase-item-title"
                            value={phase1ItemTitle1}
                            onChange={(val) => setAttributes({ phase1ItemTitle1: val })}
                            placeholder={__('Item title…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                        <RichText
                            tagName="p"
                            className="phase-text"
                            value={phase1Text1}
                            onChange={(val) => setAttributes({ phase1Text1: val })}
                            placeholder={__('Phase text…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                        <RichText
                            tagName="h4"
                            className="phase-item-title"
                            value={phase1ItemTitle2}
                            onChange={(val) => setAttributes({ phase1ItemTitle2: val })}
                            placeholder={__('Item title…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                        <RichText
                            tagName="p"
                            className="phase-text"
                            value={phase1Text2}
                            onChange={(val) => setAttributes({ phase1Text2: val })}
                            placeholder={__('Phase text…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                    </ControlsLayout>
                    <ControlsLayout columns={1} gap="0rem">
                        <RichText
                            tagName="h3"
                            className="phase-title"
                            value={phase2Title}
                            onChange={(val) => setAttributes({ phase2Title: val })}
                            placeholder={__('Phase title…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                        <RichText
                            tagName="h4"
                            className="phase-item-title"
                            value={phase2ItemTitle1}
                            onChange={(val) => setAttributes({ phase2ItemTitle1: val })}
                            placeholder={__('Item title…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                        <RichText
                            tagName="p"
                            className="phase-text"
                            value={phase2Text1}
                            onChange={(val) => setAttributes({ phase2Text1: val })}
                            placeholder={__('Phase text…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                    </ControlsLayout>
                </ControlsLayout>
                <ControlsLayout columns={2} gap="1rem">
                    <div className="cta-secondary cta-partnership">
                        <RichText
                            tagName="span"
                            value={ctaText}
                            onChange={(val) => setAttributes({ ctaText: val })}
                            placeholder={__('CTA text…', 'observata')}
                            disableLineBreaks
                            allowedFormats={[]}
                        />
                        <span className="arrow-icon">→</span>
                    </div>


                    <SelectControl
                        label={__('CTA URL', 'observata')}
                        value={ctaUrl}
                        options={pageOptions}
                        onChange={(val) => setAttributes({ ctaUrl: val })}
                    />
                </ControlsLayout>
            </ControlsLayout>
        </section>
    );
}
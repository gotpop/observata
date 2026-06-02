import './editor.css';

import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';

const CONTENT_ALLOWED_BLOCKS = ['observata/card-photo'];

export default function GridCardsPhotoEdit({ attributes, setAttributes }) {
    const { title, subtitle, sectionBgColour } = attributes;
    const blockProps = useBlockProps({ className: 'grid-cards-photo' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Grid Cards Photo" />

            <div className="grid-cards-photo-editor__controls">
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
                <RichText
                    tagName="h2"
                    className="grid-cards-photo-editor__title"
                    value={title}
                    onChange={(val) => setAttributes({ title: val })}
                    placeholder={__('Section title…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <RichText
                    tagName="p"
                    className="grid-cards-photo-editor__subtitle"
                    value={subtitle}
                    onChange={(val) => setAttributes({ subtitle: val })}
                    placeholder={__('Section subtitle…', 'observata')}
                    allowedFormats={[]}
                />
                <InnerBlocks
                    allowedBlocks={CONTENT_ALLOWED_BLOCKS}
                    template={[['observata/card-photo', {}]]}
                    templateLock={false}
                />
            </div>
        </article>
    );
}
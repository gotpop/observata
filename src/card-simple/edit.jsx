import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import GeoIcon from '../components/geo-icon';

const iconOptions = Array.from({ length: 30 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return { label: num, value: num };
});

export default function Edit({ attributes, setAttributes }) {
    const { title, description, iconGeo } = attributes;
    const blockProps = useBlockProps({ className: 'card-simple' });

    return (
        <article {...blockProps}>
            <BlockLabel name="Card Simple" />

            <div className="intro-card-icon">
                <GeoIcon number={iconGeo} />
            </div>
            <div className="intro-card-body">
                <RichText
                    tagName="h3"
                    className="card-simple__title"
                    value={title}
                    onChange={(val) => setAttributes({ title: val })}
                    placeholder={__('Card title…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <RichText
                    tagName="p"
                    className="card-simple__description"
                    value={description}
                    onChange={(val) => setAttributes({ description: val })}
                    placeholder={__('Card description…', 'observata')}
                    disableLineBreaks
                    allowedFormats={[]}
                />
                <SelectControl
                    label={__('Icon', 'observata')}
                    value={iconGeo}
                    options={iconOptions}
                    onChange={(val) => setAttributes({ iconGeo: val })}
                />
            </div>
        </article>
    );
}
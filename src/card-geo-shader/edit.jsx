import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import GeoIcon from '../components/geo-icon';
import GEO_ICON_OPTIONS from '../components/geo-icon-options';
import GraphicSelect from '../components/graphic-select';

export default function CardGeoShaderEdit({ attributes, setAttributes }) {
	const { cardTitle, cardText, iconGeo } = attributes;
	const blockProps = useBlockProps();

	return (
		<article {...blockProps}>
			<BlockLabel name="Card Geo Shader" />
			<div className="icon-geo">
				<GeoIcon number={iconGeo} />
			</div>
			<div className="card-body">
				<RichText
					tagName="h3"
					className="card-title"
					value={cardTitle}
					onChange={(val) => setAttributes({ cardTitle: val })}
					placeholder={__('Card title…', 'observata')}
					disableLineBreaks
					allowedFormats={[]}
				/>
				<RichText
					tagName="p"
					className="card-text"
					value={cardText}
					onChange={(val) => setAttributes({ cardText: val })}
					placeholder={__('Card text…', 'observata')}
					disableLineBreaks
					allowedFormats={[]}
				/>
				<GraphicSelect
					label={__('Icon geo', 'observata')}
					value={iconGeo}
					options={GEO_ICON_OPTIONS}
					onChange={(val) => setAttributes({ iconGeo: val })}
				/>
			</div>
		</article>
	);
}

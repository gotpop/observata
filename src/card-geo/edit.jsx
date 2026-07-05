import { RichText, useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import GeoIcon from '../components/geo-icon';
import GEO_ICON_OPTIONS from '../components/geo-icon-options';
import GraphicSelect from '../components/graphic-select';

export default function CardGeoEdit({ attributes, setAttributes }) {
	const { cardTitle, cardText, iconGeo } = attributes;
	const blockProps = useBlockProps({ className: 'card-geo' });

	return (
		<article {...blockProps}>
			<BlockLabel name="Card Geo" />

			<div className="icon-geo">
				<GeoIcon number={iconGeo} />
			</div>
			<div className="card-body">
				<RichText
					className="intro-card-title"
					disableLineBreaks
					onChange={(val) => setAttributes({ cardTitle: val })}
					placeholder={__('Card title…', 'observata')}
					tagName="h3"
					value={cardTitle}
					allowedFormats={[]}
				/>
				<RichText
					className="intro-card-text"
					disableLineBreaks
					onChange={(val) => setAttributes({ cardText: val })}
					placeholder={__('Card description…', 'observata')}
					tagName="p"
					value={cardText}
					allowedFormats={[]}
				/>
				<GraphicSelect
					label={__('Icon', 'observata')}
					value={iconGeo}
					options={GEO_ICON_OPTIONS}
					onChange={(val) => setAttributes({ iconGeo: val })}
				/>
			</div>
		</article>
	);
}

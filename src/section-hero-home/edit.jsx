import './editor.css';

import { RichText, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import ControlsLayout from '../components/controls-layout';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

export default function HeroEdit({ attributes, setAttributes }) {
	const { heading, subheading, mediaUrl, ctaText, ctaUrl, readMoreText, readMoreUrl } = attributes;

	// Fetch internal pages for dropdown
	const pages = useSelect((select) => {
		const { getEntityRecords } = select('core');
		return getEntityRecords('postType', 'page', { per_page: 100, _fields: 'id,title,link' });
	}, []);

	const pageOptions = [
		{ label: __('Select a page...', 'observata'), value: '' },
		...(pages || []).map((page) => ({
			label: page.title?.rendered || `Page ${page.id}`,
			value: page.link,
		})),
	];

	const blockProps = useBlockProps({
		className: 'block-section-hero-home',
		style: mediaUrl ? { backgroundImage: `url(${mediaUrl})` } : {},
	});

	return (
		<section {...blockProps}>
			<BlockLabel name="Section Hero Home" />
			<ControlsLayout columns={1} gap="1rem">
				<RichText
					tagName="h1"
					className="heading-hero"
					value={heading}
					onChange={() => {}}
					placeholder={__('Hero heading…', 'observata')}
					disableLineBreaks
					allowedFormats={[]}
					readOnly
				/>
				<RichText
					tagName="p"
					className="hero-subheading"
					value={subheading}
					onChange={(val) => setAttributes({ subheading: val })}
					placeholder={__('Subheading…', 'observata')}
					disableLineBreaks
					allowedFormats={[]}
				/>
			</ControlsLayout>
			<ControlsLayout columns={2} gap="1rem">
				<div className="cta-primary cta-hero">
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
			<ControlsLayout columns={2} gap="1rem">
				<div className="hero-read-more">
					<RichText
						tagName="span"
						value={readMoreText}
						onChange={(val) => setAttributes({ readMoreText: val })}
						placeholder={__('Read more text…', 'observata')}
						disableLineBreaks
						allowedFormats={[]}
					/>
					<span className="arrow-icon">→</span>
				</div>
				<SelectControl
					label={__('Read More URL', 'observata')}
					value={readMoreUrl}
					options={pageOptions}
					onChange={(val) => setAttributes({ readMoreUrl: val })}
				/>
			</ControlsLayout>
		</section>
	);
}

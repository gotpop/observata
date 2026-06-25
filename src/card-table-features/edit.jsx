import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import BlockLabel from '../components/block-label';
import ControlsLayout from '../components/controls-layout';
import GeoIcon from '../components/geo-icon';

const ICON_OPTIONS = Array.from({ length: 30 }, (_, i) => {
	const num = String(i + 1).padStart(2, '0');
	return { label: num, value: num };
});

export default function CardTableFeaturesEdit({ attributes, setAttributes }) {
	const { showPlanCards, featuredPlan } = attributes;
	const blockProps = useBlockProps({ className: 'card-table-features-editor' });

	const pages = useSelect((select) => {
		return (
			select('core').getEntityRecords('postType', 'page', {
				per_page: -1,
				_fields: ['id', 'title', 'link'],
			}) || []
		);
	}, []);

	const pageOptions = [
		{ label: __('Select a page...', 'observata'), value: '' },
		...pages.map((page) => ({
			label: page.title.rendered,
			value: page.link,
		})),
	];

	return (
		<div {...blockProps}>
			<BlockLabel name="Card Table Features">
				<ToggleControl
					label={__('Show Plan Cards', 'observata')}
					checked={showPlanCards}
					onChange={(value) => setAttributes({ showPlanCards: value })}
				/>
			</BlockLabel>

			{showPlanCards && (
				<ControlsLayout layout="vertical" gap="1rem">
					<SelectControl
						label={__('Featured Plan', 'observata')}
						value={featuredPlan}
						options={[
							{ label: attributes.plan1Name || __('Plan 1'), value: 1 },
							{ label: attributes.plan2Name || __('Plan 2'), value: 2 },
							{ label: attributes.plan3Name || __('Plan 3'), value: 3 },
						]}
						onChange={(value) => setAttributes({ featuredPlan: parseInt(value) })}
					/>
					<ControlsLayout columns={3} gap="1rem">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className={'editor-card' + (i === featuredPlan ? ' editor-card-highlighted' : '')}
							>
								<TextControl
									label={__('Plan ' + i + ' Name', 'observata')}
									value={attributes['plan' + i + 'Name']}
									onChange={(value) => setAttributes({ ['plan' + i + 'Name']: value })}
								/>
								<TextControl
									label={__('Plan ' + i + ' Price', 'observata')}
									value={attributes['plan' + i + 'Price']}
									onChange={(value) => setAttributes({ ['plan' + i + 'Price']: value })}
								/>
								<TextControl
									label={__('Plan ' + i + ' Description', 'observata')}
									value={attributes['plan' + i + 'Description']}
									onChange={(value) => setAttributes({ ['plan' + i + 'Description']: value })}
								/>
								<ControlsLayout layout="horizontal" gap="1rem">
									<div className="icon-geo">
										<GeoIcon
											number={attributes['plan' + i + 'Icon'] || String(i).padStart(2, '0')}
										/>
									</div>
									<SelectControl
										label={__('Plan ' + i + ' Icon', 'observata')}
										value={attributes['plan' + i + 'Icon']}
										options={ICON_OPTIONS}
										onChange={(val) => setAttributes({ ['plan' + i + 'Icon']: val })}
									/>
								</ControlsLayout>
								<ToggleControl
									label={__('Show Read More Link', 'observata')}
									checked={attributes['plan' + i + 'ShowReadMore']}
									onChange={(val) => setAttributes({ ['plan' + i + 'ShowReadMore']: val })}
								/>
								{attributes['plan' + i + 'ShowReadMore'] && (
									<>
										<TextControl
											label={__('Read More Text', 'observata')}
											value={attributes['plan' + i + 'ReadMoreText']}
											onChange={(val) => setAttributes({ ['plan' + i + 'ReadMoreText']: val })}
										/>
										<SelectControl
											label={__('Read More Link', 'observata')}
											value={attributes['plan' + i + 'ReadMoreUrl']}
											options={pageOptions}
											onChange={(val) => setAttributes({ ['plan' + i + 'ReadMoreUrl']: val })}
										/>
									</>
								)}
							</div>
						))}
					</ControlsLayout>
				</ControlsLayout>
			)}

			<div className="editor-rows">
				<InnerBlocks
					allowedBlocks={['observata/element-table-features-row']}
					templateLock={false}
				/>
			</div>
		</div>
	);
}

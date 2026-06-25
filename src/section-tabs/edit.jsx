import './editor.css';

import {
	Button,
	ButtonGroup,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import ControlsLayout from '../components/controls-layout';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

const ALLOWED_BLOCKS = ['observata/card-text-intro', 'observata/card-table-features'];

const TAB_TEMPLATE = [['observata/card-table-features', {}]];

export default function SectionTabsEdit({ attributes, setAttributes, clientId }) {
	const [localActiveTab, setLocalActiveTab] = useState(attributes.activeTab || '1');
	const { tabCount, tab1Name, tab2Name, tab3Name, sectionBgColour, activeTab } = attributes;

	const blockProps = useBlockProps({
		className: 'observata-section-tabs-editor',
	});

	// Build the list of tabs dynamically based on tabCount
	const tabDefs = [
		{ n: 1, name: tab1Name || __('Tab 1', 'observata') },
		{ n: 2, name: tab2Name || __('Tab 2', 'observata') },
		{ n: 3, name: tab3Name || __('Tab 3', 'observata') },
	];

	const visibleTabs = tabDefs.slice(0, tabCount || 3);

	// Ensure localActiveTab doesn't exceed tabCount
	const safeActiveTab = parseInt(localActiveTab, 10) > (tabCount || 3) ? '1' : localActiveTab;

	const handleTabClick = (n) => {
		setLocalActiveTab(String(n));
		setAttributes({ activeTab: String(n) });
	};

	const getInnerBlocks = () => {
		switch (safeActiveTab) {
			case '1':
				return attributes.tab1InnerBlocks || [];
			case '2':
				return attributes.tab2InnerBlocks || [];
			case '3':
				return attributes.tab3InnerBlocks || [];
			default:
				return [];
		}
	};

	const updateInnerBlocks = (blocks) => {
		switch (safeActiveTab) {
			case '1':
				setAttributes({ tab1InnerBlocks: blocks });
				break;
			case '2':
				setAttributes({ tab2InnerBlocks: blocks });
				break;
			case '3':
				setAttributes({ tab3InnerBlocks: blocks });
				break;
		}
	};

	// Build "active tab on page load" options from visible tabs
	const activeTabOptions = visibleTabs.map((t) => ({
		label: t.name,
		value: String(t.n),
	}));

	return (
		<div {...blockProps}>
			<BlockLabel name="Section Tabs">
				<RangeControl
					label={__('Number of tabs', 'observata')}
					value={tabCount || 3}
					min={1}
					max={3}
					onChange={(val) => {
						setAttributes({ tabCount: val });
						// If reducing tabs below the active one, reset to 1
						if (parseInt(safeActiveTab, 10) > val) {
							setLocalActiveTab('1');
							setAttributes({ activeTab: '1' });
						}
					}}
				/>
				<SelectControl
					label={__('Section Background', 'observata')}
					value={sectionBgColour}
					options={[
						{ label: __('White', 'observata'), value: 'white' },
						{ label: __('Grey', 'observata'), value: 'grey' },
						{
							label: __('Gradient', 'observata'),
							value: 'gradient',
						},
					]}
					onChange={(val) => setAttributes({ sectionBgColour: val })}
				/>
				<SelectControl
					label={__('Active tab on page load', 'observata')}
					value={activeTab || '1'}
					options={activeTabOptions}
					onChange={(val) => setAttributes({ activeTab: val })}
				/>
			</BlockLabel>
			<ControlsLayout layout="horizontal">
				{visibleTabs.map((tab) => (
					<TextControl
						key={tab.n}
						label={__('Tab', 'observata') + ' ' + tab.n + ' ' + __('name', 'observata')}
						value={attributes[`tab${tab.n}Name`] || ''}
						placeholder={tab.name}
						onChange={(val) => setAttributes({ [`tab${tab.n}Name`]: val })}
					/>
				))}
			</ControlsLayout>
			<div className="tabs-editor-nav">
				<ButtonGroup>
					{visibleTabs.map((tab) => (
						<Button
							key={tab.n}
							variant={safeActiveTab === String(tab.n) ? 'primary' : 'secondary'}
							onClick={() => handleTabClick(tab.n)}
						>
							{attributes[`tab${tab.n}Name`] || tab.name}
						</Button>
					))}
				</ButtonGroup>
			</div>

			<div className="tabs-editor-content">
				<InnerBlocks
					template={TAB_TEMPLATE}
					templateLock={false}
					allowedBlocks={ALLOWED_BLOCKS}
					value={getInnerBlocks()}
					onChange={updateInnerBlocks}
				/>
			</div>
		</div>
	);
}

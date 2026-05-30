import './editor.css';

import { Button, ButtonGroup, SelectControl, TextControl } from '@wordpress/components';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

// Default template for each tab
const TAB_TEMPLATE = [
    ['observata/section-intro', { textAlign: 'center' }],
    ['observata/plan-features-table', {}]
];

export default function PricingTabsEdit({ attributes, setAttributes }) {
    const [localActiveTab, setLocalActiveTab] = useState(attributes.activeTab || 'observability');
    const { sectionBgColour, mdrTabName, observabilityTabName, searchTabName, activeTab } = attributes;
    const blockProps = useBlockProps({ className: 'observata-pricing-tabs-editor' });

    // Dynamic tabs based on attribute values
    const TABS = [
        { id: 'mdr', label: mdrTabName || 'MDR' },
        { id: 'observability', label: observabilityTabName || 'Observability' },
        { id: 'search', label: searchTabName || 'Search' }
    ];

    const handleTabClick = (tabId) => {
        setLocalActiveTab(tabId);
        setAttributes({ activeTab: tabId });
    };

    // Get the inner blocks attribute for current tab
    const getCurrentInnerBlocks = () => {
        switch (localActiveTab) {
            case 'mdr':
                return attributes.mdrInnerBlocks || [];
            case 'observability':
                return attributes.observabilityInnerBlocks || [];
            case 'search':
                return attributes.searchInnerBlocks || [];
            default:
                return [];
        }
    };

    // Update the inner blocks attribute for current tab
    const updateCurrentInnerBlocks = (blocks) => {
        switch (localActiveTab) {
            case 'mdr':
                setAttributes({ mdrInnerBlocks: blocks });
                break;
            case 'observability':
                setAttributes({ observabilityInnerBlocks: blocks });
                break;
            case 'search':
                setAttributes({ searchInnerBlocks: blocks });
                break;
        }
    };

    return (
        <div {...blockProps}>
            <BlockLabel name="Pricing tabs" />
            <SelectControl
                label={__('Section Background', 'observata')}
                value={sectionBgColour}
                options={[
                    { label: __('White', 'observata'), value: 'white' },
                    { label: __('Grey', 'observata'), value: 'grey' },
                ]}
                onChange={(value) => setAttributes({ sectionBgColour: value })}
            />

            <SelectControl
                label={__('Active Tab on Page Load', 'observata')}
                value={activeTab || 'observability'}
                options={[
                    { label: mdrTabName || 'MDR', value: 'mdr' },
                    { label: observabilityTabName || 'Observability', value: 'observability' },
                    { label: searchTabName || 'Search', value: 'search' },
                ]}
                onChange={(value) => setAttributes({ activeTab: value })}
            />

            <TextControl
                label={__('Tab 1 Name', 'observata')}
                value={mdrTabName || 'MDR'}
                onChange={(value) => setAttributes({ mdrTabName: value })}
            />
            <TextControl
                label={__('Tab 2 Name', 'observata')}
                value={observabilityTabName || 'Observability'}
                onChange={(value) => setAttributes({ observabilityTabName: value })}
            />
            <TextControl
                label={__('Tab 3 Name', 'observata')}
                value={searchTabName || 'Search'}
                onChange={(value) => setAttributes({ searchTabName: value })}
            />

            <div className="pricing-tabs-editor__tabs">
                <ButtonGroup>
                    {TABS.map((tab) => (
                        <Button
                            key={tab.id}
                            isPrimary={localActiveTab === tab.id}
                            isSecondary={localActiveTab !== tab.id}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>

            <div className="editor-content">
                <InnerBlocks
                    template={TAB_TEMPLATE}
                    templateLock={false}
                    allowedBlocks={[
                        'observata/plan-features-table',
                        'observata/section-intro'
                    ]}
                    value={getCurrentInnerBlocks()}
                    onChange={updateCurrentInnerBlocks}
                />
            </div>
        </div>
    );
}
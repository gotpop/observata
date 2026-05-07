import './editor.css';

import { useState } from '@wordpress/element';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { Button, ButtonGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Default template for each tab
const TAB_TEMPLATE = [
    ['observata/section-intro', {}],
    ['observata/plan-features-table', {}]
];

const TABS = [
    { id: 'mdr', label: 'MDR' },
    { id: 'observability', label: 'Observability' },
    { id: 'search', label: 'Search' }
];

export default function PricingTabsEdit({ attributes, setAttributes }) {
    const [localActiveTab, setLocalActiveTab] = useState(attributes.activeTab || 'mdr');
    const blockProps = useBlockProps({ className: 'observata-pricing-tabs-editor' });

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
            <div className="pricing-tabs-editor__header">
                <label className="pricing-tabs-editor__label">
                    {__('Pricing Tabs', 'observata')}
                </label>
            </div>

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

            <div className="pricing-tabs-editor__content">
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
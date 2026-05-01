import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import SectionIntro from '../components/section-intro';

const PLAN_TEMPLATE = [
    ['observata/plan', {
        planName: 'Starter',
        planPrice: '$0',
        planPricePeriod: '/month',
        planDescription: 'Perfect for getting started with basic observability.',
        planFeatures: ['Up to 5 hosts monitored', '1-day log retention', 'Basic dashboards', 'Community support'],
        ctaText: 'Get started',
        isHighlighted: false,
    }],
    ['observata/plan', {
        planName: 'Pro',
        planPrice: '$49',
        planPricePeriod: '/month',
        planDescription: 'For teams that need advanced monitoring and alerting.',
        planFeatures: ['Up to 50 hosts monitored', '30-day log retention', 'Advanced dashboards & alerts', 'APM & distributed tracing', 'Priority support'],
        ctaText: 'Start free trial',
        isHighlighted: true,
    }],
    ['observata/plan', {
        planName: 'Enterprise',
        planPrice: 'Custom',
        planPricePeriod: '',
        planDescription: 'For organisations with complex observability requirements.',
        planFeatures: ['Unlimited hosts', 'Custom log retention', 'Custom dashboards & integrations', 'Dedicated account manager', 'SLA & 24/7 support'],
        ctaText: 'Contact sales',
        isHighlighted: false,
    }],
];

export default function PlansEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'observata-plans-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Pricing Plans" />
            <SectionIntro attributes={attributes} setAttributes={setAttributes} />

            <div className="plans-inner-blocks">
                <InnerBlocks
                    template={PLAN_TEMPLATE}
                    allowedBlocks={['observata/plan']}
                    templateLock={false}
                />
            </div>
        </div>
    );
}
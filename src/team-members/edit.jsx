import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const MEMBER_TEMPLATE = [
    ['observata/card-team-member', {
        name: 'Sarah Chen',
        role: 'CEO & Co-founder',
        bio: '15 years in enterprise observability. Previously VP Engineering at a leading SIEM vendor.',
        linkedinUrl: '#',
        twitterUrl: '#',
    }],
    ['observata/card-team-member', {
        name: 'Marcus Webb',
        role: 'CTO & Co-founder',
        bio: 'Distributed systems architect. Elastic certified engineer with a passion for OpenTelemetry.',
        linkedinUrl: '#',
        twitterUrl: '#',
    }],
    ['observata/card-team-member', {
        name: 'Priya Sharma',
        role: 'Head of Customer Success',
        bio: 'Ensures every client gets maximum value. 10+ years in SaaS customer operations.',
        linkedinUrl: '#',
    }],
];

export default function TeamMembersEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'team-members-editor' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Team Members" />

            <div className="observata-controls">
                <TextControl
                    label={__('Section Title', 'observata')}
                    value={attributes.sectionTitle}
                    onChange={(value) => setAttributes({ sectionTitle: value })}
                />
                <TextControl
                    label={__('Intro Text', 'observata')}
                    value={attributes.introText}
                    onChange={(value) => setAttributes({ introText: value })}
                />
            </div>

            <div className="team-members-editor__grid">
                <InnerBlocks
                    template={MEMBER_TEMPLATE}
                    allowedBlocks={['observata/card-team-member']}
                    templateLock={false}
                />
            </div>
        </div>
    );
}
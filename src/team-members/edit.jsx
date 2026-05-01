import './editor.css';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import SectionIntro from '../components/section-intro';

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
            <SectionIntro attributes={attributes} setAttributes={setAttributes} />

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
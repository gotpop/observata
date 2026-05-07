import './editor.css';

import { useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';
import SectionIntro from '../components/section-intro';

export default function SectionIntroEdit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'section-intro-editor-wrapper' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Section Intro" />
            <SectionIntro attributes={attributes} setAttributes={setAttributes} />
        </div>
    );
}

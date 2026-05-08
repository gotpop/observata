import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export default function BlogPostsEdit({ attributes, setAttributes }) {
    const { postsPerPage } = attributes;
    const blockProps = useBlockProps({ className: 'blog-posts-editor' });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Blog Posts Settings', 'observata')}>
                    <RangeControl
                        label={__('Posts per page', 'observata')}
                        value={postsPerPage}
                        onChange={(value) => setAttributes({ postsPerPage: value })}
                        min={1}
                        max={50}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="blog-posts-editor__placeholder">
                    <span className="blog-posts-editor__icon">📝</span>
                    <span className="blog-posts-editor__label">
                        Blog Posts ({postsPerPage} posts)
                    </span>
                </div>
            </div>
        </>
    );
}
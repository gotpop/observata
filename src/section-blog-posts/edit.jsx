import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export default function BlogPostsEdit({ attributes, setAttributes }) {
    const { postsPerPage, sectionBgColour } = attributes;
    const blockProps = useBlockProps({ className: 'blog-posts-editor' });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Blog Posts Settings', 'observata')}>
                    <SelectControl
                        label={__('Section Background', 'observata')}
                        value={sectionBgColour}
                        options={[
                            { label: __('White', 'observata'), value: 'white' },
                            { label: __('Grey', 'observata'), value: 'grey' },
                            { label: __('Gradient', 'observata'), value: 'gradient' },
                        ]}
                        onChange={(value) => setAttributes({ sectionBgColour: value })}
                    />
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
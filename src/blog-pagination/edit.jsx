import { useBlockProps } from '@wordpress/block-editor';

import BlockLabel from '../components/block-label';

export default function BlogPaginationEdit() {
    const blockProps = useBlockProps({ className: 'blog-pagination' });

    return (
        <div {...blockProps}>
            <BlockLabel name="Blog Pagination" />
            <div className="block-content">
                <p>This block displays previous/next post navigation on single blog posts.</p>
                <div className="blog-pagination__container" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>&larr;</span>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#999' }}>PREVIOUS</div>
                            <div style={{ fontWeight: 500 }}>Post Title</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', color: '#999' }}>NEXT</div>
                            <div style={{ fontWeight: 500 }}>Post Title</div>
                        </div>
                        <span>&rarr;</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
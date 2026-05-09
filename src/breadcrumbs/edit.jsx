import './editor.css';
import { useBlockProps } from '@wordpress/block-editor';

export default function BreadcrumbsEdit() {
    const blockProps = useBlockProps({ className: 'breadcrumbs-editor' });

    return (
        <div {...blockProps}>
            <div className="breadcrumbs-preview">
                <span>Home &raquo; Current Page</span>
            </div>
        </div>
    );
}

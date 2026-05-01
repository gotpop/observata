import './block-label.css';

export default function BlockLabel({ name, children }) {
    return (
        <div className="intro">
            <observata-block-label>{name}</observata-block-label>
            {children && <div className="observata-controls">{children}</div>}
        </div>
    );
}

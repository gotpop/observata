export default function ControlsLayout({ layout = 'vertical', gap = '1rem', children, style }) {
    const isHorizontal = layout === 'horizontal';

    return (
        <div
            className="observata-controls-layout"
            style={{
                display: 'flex',
                flexDirection: isHorizontal ? 'row' : 'column',
                gap,
                ...(isHorizontal ? { alignItems: 'center' } : {}),
                ...style,
            }}
        >
            {children}
        </div>
    );
}

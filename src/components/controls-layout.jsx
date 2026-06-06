export default function ControlsLayout({ layout = 'vertical', columns, gap = '1rem', children, style }) {
    const isHorizontal = layout === 'horizontal';
    const isGrid = columns > 1;

    return (
        <div
            className="observata-controls-layout"
            style={{
                display: isGrid ? 'grid' : 'flex',
                ...(isGrid
                    ? {
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gap,
                        marginBlockEnd: '1rem',
                    }
                    : {
                        flexDirection: isHorizontal ? 'row' : 'column',
                        gap,
                        marginBlockEnd: '1rem',
                        ...(isHorizontal ? { alignItems: 'center' } : {}),
                    }),
                ...style,
            }}
        >
            {children}
        </div>
    );
}

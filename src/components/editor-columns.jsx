export default function EditorColumns({ columns = 3, children, style }) {
    return (
        <div
            className="observata-editor-columns"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: '1rem',
                ...style,
            }}
        >
            {children}
        </div>
    );
}

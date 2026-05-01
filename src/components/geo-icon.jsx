export default function GeoIcon({ number, className = 'geo-icon' }) {
    if (!number) {
        return <span className={className}>?</span>;
    }

    const url = `/wp-content/themes/observata/assets/svg/geo/${number}-icon-geo.svg`;

    return (
        <img
            src={url}
            className={className}
            alt={`Geo icon ${number}`}
            width="48"
            height="48"
        />
    );
}
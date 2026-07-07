export default function GeoIcon({ number, className = 'geo-icon' }) {
	if (!number) {
		return <span className={className}>?</span>;
	}

	const baseUrl = window.observata?.templateUrl || '';
	const url = `${baseUrl}/assets/svg/icons/geo/${number}.svg`;

	return <img src={url} className={className} alt={`Geo icon ${number}`} width="48" height="48" />;
}

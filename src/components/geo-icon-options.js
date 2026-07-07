function getSvgBase() {
	return (window.observata?.templateUrl || '') + '/assets/svg';
}

/**
 * Geo icon options (01–30) with SVG preview URLs for GraphicSelect.
 * Shared across all blocks that use a geo icon picker.
 */
const GEO_ICON_OPTIONS = Array.from({ length: 30 }, (_, i) => {
	const num = String(i + 1).padStart(2, '0');
	return {
		label: `Icon ${num}`,
		value: num,
		get icon() {
			return `${getSvgBase()}/icons/geo/${num}.svg`;
		},
	};
});

export default GEO_ICON_OPTIONS;

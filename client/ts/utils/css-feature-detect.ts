/**
 * CSS feature detection via `CSS.supports()`.
 *
 * If the browser does NOT support the given property/value pair,
 * a `no-<className>` class is added to the document element (`<html>`).
 * The class name defaults to the property name but can be overridden — useful
 * when the detection property differs from the conceptual feature name used in
 * CSS (e.g. detecting `animation-timeline` but labelling it `no-view-timeline`).
 *
 * @example
 * detectCssFeature('animation-timeline', 'scroll()', 'no-view-timeline');
 * // Adds `no-view-timeline` to <html> if unsupported
 */
export function detectCssFeature(property: string, value: string, className?: string): boolean {
	const supported =
		typeof CSS !== 'undefined' &&
		typeof CSS.supports === 'function' &&
		CSS.supports(property, value);

	if (!supported) {
		document.documentElement.classList.add(className ?? `no-${property}`);
	}

	return supported;
}

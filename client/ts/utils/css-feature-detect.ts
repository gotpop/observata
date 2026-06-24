/**
 * CSS feature detection via `CSS.supports()`.
 *
 * If the browser does NOT support the given property/value pair,
 * a `no-<property>` class is added to the document element (`<html>`).
 *
 * @example
 * detectCssFeature('view-timeline', 'auto');
 * // Adds `no-view-timeline` to <html> if unsupported
 */
export function detectCssFeature(property: string, value: string): boolean {
	const supported =
		typeof CSS !== 'undefined' &&
		typeof CSS.supports === 'function' &&
		CSS.supports(property, value);

	if (!supported) {
		document.documentElement.classList.add(`no-${property}`);
	}

	return supported;
}

/**
 * Browser and device detection utilities.
 *
 * These read CSS classes set by `inc/device-detection.php` on `<html>`,
 * so they stay in sync with the server-side UA sniffing without
 * duplicating the logic here.
 */

type BrowserName = 'chrome' | 'safari' | 'edge' | 'firefox' | 'brave' | 'opera';
type PlatformName = 'ios' | 'android';

function hasClass(cls: string): boolean {
	return document.documentElement.classList.contains(cls);
}

/** Returns the name of the detected browser, or `null` if unknown. */
export function getBrowserName(): BrowserName | null {
	const browsers: BrowserName[] = ['chrome', 'safari', 'edge', 'firefox', 'brave', 'opera'];

	for (const b of browsers) {
		if (hasClass(b)) return b;
	}

	return null;
}

/** Shorthand checks for specific browsers. */
export const isChrome = (): boolean => hasClass('chrome');
export const isSafari = (): boolean => hasClass('safari');
export const isEdge = (): boolean => hasClass('edge');
export const isFirefox = (): boolean => hasClass('firefox');
export const isBrave = (): boolean => hasClass('brave');
export const isOpera = (): boolean => hasClass('opera');

/** Returns the mobile platform, or `null` on desktop. */
export function getPlatform(): PlatformName | 'desktop' {
	if (hasClass('ios')) return 'ios';
	if (hasClass('android')) return 'android';

	return 'desktop';
}

/** True on any mobile device (iOS or Android). */
export const isMobile = (): boolean => hasClass('mobile');

/** True on desktop (non-mobile). */
export const isDesktop = (): boolean => hasClass('desktop');

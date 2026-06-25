import { beforeEach, describe, expect, it } from 'vitest';
import {
	getBrowserName,
	getPlatform,
	isBrave,
	isChrome,
	isDesktop,
	isEdge,
	isFirefox,
	isMobile,
	isOpera,
	isSafari,
} from './browser';

describe('browser detection', () => {
	beforeEach(() => {
		document.documentElement.className = '';
	});

	describe('getBrowserName', () => {
		it('returns the detected browser class', () => {
			document.documentElement.classList.add('chrome');
			expect(getBrowserName()).toBe('chrome');
		});

		it('returns null when no browser class is present', () => {
			expect(getBrowserName()).toBeNull();
		});

		it('detects safari', () => {
			document.documentElement.classList.add('safari');
			expect(getBrowserName()).toBe('safari');
		});

		it('detects firefox', () => {
			document.documentElement.classList.add('firefox');
			expect(getBrowserName()).toBe('firefox');
		});
	});

	describe('is* shorthand checks', () => {
		it('isChrome returns true when chrome class present', () => {
			document.documentElement.classList.add('chrome');
			expect(isChrome()).toBe(true);
			expect(isSafari()).toBe(false);
		});

		it('isEdge returns true when edge class present', () => {
			document.documentElement.classList.add('edge');
			expect(isEdge()).toBe(true);
			expect(isChrome()).toBe(false);
		});

		it('isBrave returns true when brave class present', () => {
			document.documentElement.classList.add('brave');
			expect(isBrave()).toBe(true);
		});

		it('isOpera returns true when opera class present', () => {
			document.documentElement.classList.add('opera');
			expect(isOpera()).toBe(true);
		});

		it('isFirefox returns true when firefox class present', () => {
			document.documentElement.classList.add('firefox');
			expect(isFirefox()).toBe(true);
		});
	});

	describe('getPlatform', () => {
		it('returns ios when ios class present', () => {
			document.documentElement.classList.add('ios');
			expect(getPlatform()).toBe('ios');
		});

		it('returns android when android class present', () => {
			document.documentElement.classList.add('android');
			expect(getPlatform()).toBe('android');
		});

		it('returns desktop when no mobile class present', () => {
			document.documentElement.classList.add('desktop');
			expect(getPlatform()).toBe('desktop');
		});
	});

	describe('isMobile / isDesktop', () => {
		it('isMobile returns true when mobile class present', () => {
			document.documentElement.classList.add('mobile');
			expect(isMobile()).toBe(true);
			expect(isDesktop()).toBe(false);
		});

		it('isDesktop returns true when desktop class present', () => {
			document.documentElement.classList.add('desktop');
			expect(isDesktop()).toBe(true);
			expect(isMobile()).toBe(false);
		});
	});
});

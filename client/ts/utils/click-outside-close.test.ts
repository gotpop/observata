import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { removeClickOutsideClose, setupClickOutsideClose } from './click-outside-close';

describe('click-outside-close', () => {
	let trigger: HTMLElement;
	let content: HTMLElement;

	beforeEach(() => {
		trigger = document.createElement('button');
		content = document.createElement('div');
		content.classList.add('is-open');
		document.body.appendChild(trigger);
		document.body.appendChild(content);
	});

	afterEach(() => {
		removeClickOutsideClose();
		trigger.remove();
		content.remove();
	});

	it('does nothing if trigger is null', () => {
		expect(() => setupClickOutsideClose(null, content)).not.toThrow();
	});

	it('does nothing if content is null', () => {
		expect(() => setupClickOutsideClose(trigger, null)).not.toThrow();
	});

	it('closes content when clicking outside trigger and content', () => {
		setupClickOutsideClose(trigger, content);

		const outside = document.createElement('div');
		document.body.appendChild(outside);
		outside.click();

		expect(content.classList.contains('is-open')).toBe(false);
		outside.remove();
	});

	it('does not close when clicking inside content', () => {
		setupClickOutsideClose(trigger, content);

		content.click();

		expect(content.classList.contains('is-open')).toBe(true);
	});

	it('does not close when clicking trigger', () => {
		setupClickOutsideClose(trigger, content);

		trigger.click();

		expect(content.classList.contains('is-open')).toBe(true);
	});

	it('does not close when content is not open', () => {
		content.classList.remove('is-open');
		setupClickOutsideClose(trigger, content);

		const outside = document.createElement('div');
		document.body.appendChild(outside);
		outside.click();
		outside.remove();

		expect(content.classList.contains('is-open')).toBe(false);
	});

	it('calls onOutsideClick callback when clicking outside', () => {
		const cb = vi.fn();
		setupClickOutsideClose(trigger, content, cb);

		const outside = document.createElement('div');
		document.body.appendChild(outside);
		outside.click();

		expect(cb).toHaveBeenCalledTimes(1);
		outside.remove();
	});

	it('updates aria-expanded attributes on close', () => {
		trigger.setAttribute('aria-expanded', 'true');
		content.setAttribute('aria-expanded', 'true');

		setupClickOutsideClose(trigger, content);

		const outside = document.createElement('div');
		document.body.appendChild(outside);
		outside.click();

		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(content.getAttribute('aria-expanded')).toBe('false');
		outside.remove();
	});

	it('removes handler after first outside click', () => {
		setupClickOutsideClose(trigger, content);

		const outside = document.createElement('div');
		document.body.appendChild(outside);

		// Re-open content
		content.classList.add('is-open');
		outside.click();
		expect(content.classList.contains('is-open')).toBe(false);

		// Re-open again — handler should have been removed, so clicking outside does nothing
		content.classList.add('is-open');
		outside.click();
		expect(content.classList.contains('is-open')).toBe(true);

		outside.remove();
	});
});

/**
 * Sphere scroll-trigger animation.
 *
 * A dedicated IntersectionObserver that watches the section heading
 * (h2[data-sphere-trigger]). When the heading enters the viewport the
 * `in-view-sphere` class is added to the sibling `<graphic-sphere>` element,
 * enabling CSS-driven transitions on the triangles and circles.
 *
 * Scoped to the observability section only.
 */
export function initSphereAnimation(): void {
	const triggers = document.querySelectorAll<HTMLElement>('h2[data-sphere-trigger]');

	if (triggers.length === 0) return;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				const section = entry.target.closest('section');
				if (!section) continue;

				const sphere = section.querySelector<HTMLElement>('.graphic-sphere');
				if (!sphere) continue;

				sphere.classList.toggle('in-view-sphere', entry.isIntersecting);
			}
		},
		{
			/* Enter once the h2 is 100px from the top, exit when 100px from the bottom */
			rootMargin: '-100px 0px -100px 0px',
			threshold: 0,
		}
	);

	triggers.forEach((trigger) => observer.observe(trigger));
}

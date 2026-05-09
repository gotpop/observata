const observerOptions = {
	threshold: 0.6,
	rootMargin: '0px 0px 0px 0px',
};

const observer = new IntersectionObserver((entries) => {
	for (const entry of entries) {
		if (entry.isIntersecting) {
			entry.target.classList.add('in-view');
		} else {
			entry.target.classList.remove('in-view');
		}
	}
}, observerOptions);

export function initSectionObserver() {
	const sections = document.querySelectorAll<HTMLElement>('.section-block');

	for (const section of sections) {
		observer.observe(section);
	}
}

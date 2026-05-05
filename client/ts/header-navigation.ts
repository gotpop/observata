document.addEventListener('DOMContentLoaded', () => {
	const trigger = document.getElementById('trigger-navigation');
	const headerContent = document.getElementById('header-content');

	if (trigger && headerContent) {
		trigger.addEventListener('click', () => {
			headerContent.classList.toggle('is-open');
		});
	}
});

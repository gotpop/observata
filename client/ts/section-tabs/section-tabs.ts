class SectionTabs {
	private tabs: HTMLButtonElement[];
	private panels: HTMLElement[];

	constructor(container: HTMLElement) {
		this.tabs = Array.from(container.querySelectorAll('.section-tabs__tab')) as HTMLButtonElement[];
		this.panels = Array.from(container.querySelectorAll('.section-tabs__panel'));
	}

	public init(): void {
		this.tabs.forEach((tab) => {
			tab.addEventListener('click', () => this.activate(tab));
			tab.addEventListener('keydown', (e) => this.onKeydown(e, tab));
		});
	}

	private activate(tab: HTMLButtonElement): void {
		const target = tab.dataset.tab;

		this.tabs.forEach((t) => {
			const active = t === tab;
			t.classList.toggle('is-active', active);
			t.setAttribute('aria-selected', String(active));
			t.tabIndex = active ? 0 : -1;
		});

		this.panels.forEach((p) => {
			const active = p.dataset.panel === target;
			p.classList.toggle('is-active', active);
			if (active) p.removeAttribute('hidden');
			else p.setAttribute('hidden', '');
		});
	}

	private onKeydown(e: KeyboardEvent, tab: HTMLButtonElement): void {
		const tabs = this.tabs;
		const i = tabs.indexOf(tab);
		let next = -1;

		switch (e.key) {
			case 'ArrowRight':
				next = (i + 1) % tabs.length;
				break;
			case 'ArrowLeft':
				next = (i - 1 + tabs.length) % tabs.length;
				break;
			case 'Home':
				next = 0;
				break;
			case 'End':
				next = tabs.length - 1;
				break;
		}

		if (next >= 0) {
			e.preventDefault();
			this.activate(tabs[next]);
			tabs[next].focus();
		}
	}
}

export function initSectionTabs(): void {
	document.querySelectorAll('.section-tabs').forEach((el) => {
		if (el instanceof HTMLElement) {
			new SectionTabs(el).init();
		}
	});
}

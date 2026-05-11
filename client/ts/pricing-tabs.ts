class PricingTabs {
	private container: HTMLElement;
	private tabs: HTMLButtonElement[];
	private panels: Map<string, HTMLElement>;

	constructor(container: HTMLElement) {
		this.container = container;
		this.tabs = Array.from(container.querySelectorAll('.pricing-tabs__tab')) as HTMLButtonElement[];
		this.panels = new Map();

		this.cachePanels();
		this.init();
	}

	private cachePanels(): void {
		this.tabs.forEach((tab) => {
			const panelId = tab.getAttribute('aria-controls');
			const tabId = tab.dataset.tab;

			if (panelId && tabId) {
				const panel = document.getElementById(panelId);
				if (panel) {
					this.panels.set(tabId, panel);
				}
			}
		});
	}

	private init(): void {
		this.tabs.forEach((tab) => {
			tab.addEventListener('click', (e) => {
				e.preventDefault();
				const tabId = tab.dataset.tab;
				if (tabId) {
					this.switchTab(tabId);
				}
			});
		});
	}

	private switchTab(tabId: string): void {
		this.tabs.forEach((tab) => {
			const isActive = tab.dataset.tab === tabId;
			tab.classList.toggle('is-active', isActive);
			tab.setAttribute('aria-selected', String(isActive));
		});

		this.panels.forEach((panel, panelTabId) => {
			panel.classList.toggle('is-active', panelTabId === tabId);
		});

		this.container.setAttribute('data-active-tab', tabId);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.pricing-tabs').forEach((container) => {
		if (container instanceof HTMLElement && container.querySelectorAll('.pricing-tabs__tab').length > 0) {
			new PricingTabs(container);
		}
	});
});

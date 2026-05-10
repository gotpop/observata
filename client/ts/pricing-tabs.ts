interface TabButton extends HTMLButtonElement {
	dataset: {
		tab: string;
	};
}

interface TabPanel extends HTMLElement {
	dataset: {
		panel: string;
	};
}

class PricingTabs {
	private container: HTMLElement;
	private tabs: TabButton[];
	private panels: Map<string, TabPanel>;

	constructor(container: HTMLElement) {
		this.container = container;
		this.tabs = Array.from(container.querySelectorAll('.pricing-tabs__tab')) as TabButton[];
		this.panels = new Map();

		// Cache panel references
		this.tabs.forEach((tab) => {
			const panelId = tab.getAttribute('aria-controls');
			if (panelId) {
				const panel = document.getElementById(panelId);
				if (panel && panel instanceof HTMLElement) {
					this.panels.set(tab.dataset.tab, panel as TabPanel);
				}
			}
		});

		this.init();
	}

	private init(): void {
		this.tabs.forEach((tab) => {
			tab.addEventListener('click', (e) => {
				e.preventDefault();
				this.switchTab(tab.dataset.tab);
			});
		});
	}

	private async switchTab(tabId: string): Promise<void> {
		// Check if View Transitions API is supported
		if (!document.startViewTransition) {
			this.updateActiveState(tabId);
			return;
		}

		// Get current active tab
		const currentTabId = this.container.getAttribute('data-active-tab') || '';

		// Don't transition if same tab
		if (currentTabId === tabId) return;

		// Determine direction based on tab order
		const tabOrder = ['mdr', 'observability', 'search'];
		const currentIndex = tabOrder.indexOf(currentTabId);
		const newIndex = tabOrder.indexOf(tabId);
		const direction = newIndex > currentIndex ? 'right' : 'left';

		// Set view-transition-name on BOTH panels BEFORE starting the transition
		// This prevents flickering — both old and new snapshots need matching names
		const transitionName = `panel-${direction}`;
		const oldPanel = this.panels.get(currentTabId);
		const newPanel = this.panels.get(tabId);

		if (oldPanel) {
			oldPanel.style.viewTransitionName = transitionName;
		}
		if (newPanel) {
			newPanel.style.viewTransitionName = transitionName;
		}

		// Also set tab-underline on both old and new active tabs before transition
		const oldTab = this.tabs.find((tab) => tab.dataset.tab === currentTabId);
		const newTab = this.tabs.find((tab) => tab.dataset.tab === tabId);

		if (oldTab) {
			oldTab.style.viewTransitionName = 'tab-underline';
		}
		if (newTab) {
			newTab.style.viewTransitionName = 'tab-underline';
		}

		// Use View Transitions API for smooth animation with direction
		const transition = document.startViewTransition(() => {
			this.updateActiveState(tabId);
		});

		// Clean up view-transition-names after transition finishes
		try {
			await transition.finished;
		} catch (error) {
			// AbortError is expected when transitions overlap - safe to ignore
			if (error instanceof DOMException && error.name === 'AbortError') {
				return;
			}
			throw error;
		} finally {
			this.panels.forEach((panel) => {
				panel.style.viewTransitionName = '';
			});
			this.tabs.forEach((tab) => {
				tab.style.viewTransitionName = '';
			});
		}
	}

	private updateActiveState(tabId: string): void {
		// Update active tab
		this.tabs.forEach((tab) => {
			const isActive = tab.dataset.tab === tabId;
			tab.classList.toggle('is-active', isActive);
			tab.setAttribute('aria-selected', String(isActive));
		});

		// Update active panel
		this.panels.forEach((panel, panelTabId) => {
			const isActive = panelTabId === tabId;
			panel.classList.toggle('is-active', isActive);
		});

		// Update container data attribute
		this.container.setAttribute('data-active-tab', tabId);
	}
}

// Initialize pricing tabs on DOM ready
document.addEventListener('DOMContentLoaded', () => {
	const containers = document.querySelectorAll('.pricing-tabs');
	containers.forEach((container) => {
		if (container instanceof HTMLElement) {
			const tabs = container.querySelectorAll('.pricing-tabs__tab');
			if (tabs.length > 0) {
				new PricingTabs(container);
			}
		}
	});
});

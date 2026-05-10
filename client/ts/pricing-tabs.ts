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
        this.tabs = Array.from(
            container.querySelectorAll('.pricing-tabs__tab')
        ) as TabButton[];
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
            this.switchTabWithoutTransition(tabId);
            return;
        }

        // Get current active tab
        const currentTabId = this.container.getAttribute('data-active-tab') || '';

        // Determine direction based on tab order
        const tabOrder = ['mdr', 'observability', 'search'];
        const currentIndex = tabOrder.indexOf(currentTabId);
        const newIndex = tabOrder.indexOf(tabId);
        const direction = newIndex > currentIndex ? 'right' : 'left';

        // Use View Transitions API for smooth animation with direction
        try {
            await document.startViewTransition(() => {
                this.switchTabWithoutTransition(tabId, direction);
            }).finished;
        } catch (error) {
            // AbortError is expected when transitions overlap - safe to ignore
            if (error instanceof DOMException && error.name === 'AbortError') {
                return;
            }
            throw error;
        }
    }

    private switchTabWithoutTransition(tabId: string, direction: string): void {
        // Update active tab
        this.tabs.forEach((tab) => {
            const isActive = tab.dataset.tab === tabId;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });

        // Update active panel with directional view-transition-name
        this.panels.forEach((panel, panelTabId) => {
            const isActive = panelTabId === tabId;
            panel.classList.toggle('is-active', isActive);

            // Apply view-transition-name for animation direction
            if (isActive) {
                panel.style.viewTransitionName = `panel-${direction}`;
            } else {
                panel.style.viewTransitionName = '';
            }
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
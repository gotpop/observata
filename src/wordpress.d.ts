// WordPress type declarations
declare module '@wordpress/components' {
	export const Button: React.ComponentType<any>;
	export const Notice: React.ComponentType<any>;
	export const Spinner: React.ComponentType<any>;
	export const TextControl: React.ComponentType<any>;
}

declare module '@wordpress/editor' {
	export const PluginSidebar: React.ComponentType<any>;
	export const PluginSidebarMoreMenuItem: React.ComponentType<any>;
}

declare module '@wordpress/element' {
	export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps: any[]) => T;
	export const useState: <T>(initialState: T | (() => T)) => [T, React.Dispatch<React.SetStateAction<T>>];
}

declare module '@wordpress/data' {
	export const useDispatch: (key: string) => any;
}

declare module '@wordpress/i18n' {
	export const __: (text: string, domain: string) => string;
}

declare module '@wordpress/plugins' {
	export const registerPlugin: (name: string, options: any) => void;
}
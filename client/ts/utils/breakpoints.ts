export const BREAKPOINTS = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Min-width queries — matches this breakpoint and up. */
export const MQ: Record<Breakpoint, string> = {
	sm: `(width >= ${BREAKPOINTS.sm}px)`,
	md: `(width >= ${BREAKPOINTS.md}px)`,
	lg: `(width >= ${BREAKPOINTS.lg}px)`,
	xl: `(width >= ${BREAKPOINTS.xl}px)`,
	'2xl': `(width >= ${BREAKPOINTS['2xl']}px)`,
};

/** Exact-range queries — matches only this breakpoint's width range. */
export const MQ_ONLY: Record<Breakpoint, string> = {
	sm: `(width >= ${BREAKPOINTS.sm}px) and (width < ${BREAKPOINTS.md}px)`,
	md: `(width >= ${BREAKPOINTS.md}px) and (width < ${BREAKPOINTS.lg}px)`,
	lg: `(width >= ${BREAKPOINTS.lg}px) and (width < ${BREAKPOINTS.xl}px)`,
	xl: `(width >= ${BREAKPOINTS.xl}px) and (width < ${BREAKPOINTS['2xl']}px)`,
	'2xl': `(width >= ${BREAKPOINTS['2xl']}px)`,
};

/** Max-width queries — matches below this breakpoint. */
export const MQ_MAX: Record<Breakpoint, string> = {
	sm: `(width < ${BREAKPOINTS.sm}px)`,
	md: `(width < ${BREAKPOINTS.md}px)`,
	lg: `(width < ${BREAKPOINTS.lg}px)`,
	xl: `(width < ${BREAKPOINTS.xl}px)`,
	'2xl': `(width < ${BREAKPOINTS['2xl']}px)`,
};

export function createMatchMedia(breakpoint: Breakpoint): MediaQueryList {
	return window.matchMedia(MQ[breakpoint]);
}

export function createMatchMediaOnly(breakpoint: Breakpoint): MediaQueryList {
	return window.matchMedia(MQ_ONLY[breakpoint]);
}

export function createMatchMediaMax(breakpoint: Breakpoint): MediaQueryList {
	return window.matchMedia(MQ_MAX[breakpoint]);
}

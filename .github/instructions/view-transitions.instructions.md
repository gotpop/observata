---
description: 'View Transitions debugging helpers and cross-document VT architecture'
applyTo:
  - '**/*'
---

# View Transitions

The theme has mature **cross-document View Transitions** (MPA) — do not break
them. They are enabled site-wide via `@view-transition { navigation: auto }` in
`client/css/global/global.css`, with element morphing via dynamic
`view-transition-name` on logos, hero headings, and blog cards (set in Twig
templates using post slugs).

## Debugging — `window.vt`

The `view-transitions-toolkit` package exposes debug helpers on `window.vt`
(implemented in `client/ts/view-transitions/debug.ts`). The module is **inert** —
it attaches functions but logs nothing to the console automatically. No flags or
initialization needed.

**Dev server:** `http://localhost:10005/`

Key helpers (all take a `ViewTransition` object as first arg):

- `vt.supports` — feature-detection matrix object
- `vt.active()` — shortcut for `document.activeViewTransition` (Chrome native;
  returns `undefined` on Safari 18 or when no transition is in-flight)
- `vt.getAnimations(vt)` — inspect running animations (filter by name/part)
- `vt.pause(vt)` / `vt.resume(vt)` — freeze / resume a transition
- `vt.scrub(vt, 0.5)` — scrub to a progress point (auto-pauses)
- `vt.extractGeometry(anim)` — before/after dimensions of a VT group
- `vt.optimizeGroupAnimations(vt, '*')` — swap width/height for transforms
- `vt.ViewTransitionPart`, `vt.OPTIMIZATION_STRATEGY` — enums
- `vt.setTemporaryViewTransitionNames(...)`, `vt.extractViewTransitionName(...)`

**Timing gotcha:** `vt.active()` is only non-null while a transition is
in-flight (~0.25–1s). Call `vt.pause(vt.active())` the instant a transition
starts, then inspect at leisure.

**No fallback shim** — on browsers without `document.activeViewTransition`
(Safari 18 cross-doc), `vt.active()` returns `undefined` and helpers are
unavailable. Existing transitions still run gracefully. Do NOT add
`trackActiveViewTransition`.

Full reference: `.github/docs/view-transitions-debugging.md`

## Same-Document VT

`client/ts/section-tabs/section-tabs.ts` uses same-document VT for tab switches
with `forward`/`backward` types. Do not modify this pattern.

## Future Work (not yet implemented)

`useAutoTypes` (directional page-to-page transitions via `from-X`/`to-Y` route
types) is deferred. It requires a render-blocking ES module in `<head>` (types
must be set pre-snapshot), which can't use the webpack runtime chunk (deferred
at load time). Would need a standalone esbuild bundle.

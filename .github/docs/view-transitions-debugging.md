# View Transitions Debugging

The `view-transitions-toolkit` package exposes debug helper functions on
`window.vt` for inspecting and controlling View Transitions from the DevTools
console.

> **Dev server:** `http://localhost:10005/`

## How it works

The module (`client/ts/view-transitions/debug.ts`) is **inert** — it attaches
functions to `window.vt` but runs nothing automatically. Nothing appears in the
console until you call a helper manually. This keeps production output clean.

No flags, no extra code, no initialization call needed — the helpers are
available the moment `client.js` loads (on every page).

## Quick start

1. Open DevTools Console on any page.
2. Confirm the namespace loaded:

   ```js
   vt.supports;
   ```

   Returns a feature-detection matrix:

   ```js
   {
     sameDocument: true,
     types: true,
     crossDocument: true,
     elementScoped: true,
     activeViewTransition: true,
   }
   ```

3. Navigate to another page (click a link — this triggers a cross-document
   transition).
4. **Immediately** type a command in the console while the transition is
   running:

   ```js
   vt.getAnimations(vt.active()); // inspect running animations
   vt.pause(vt.active()); // freeze the transition
   vt.scrub(vt.active(), 0.5); // scrub to 50%
   vt.resume(vt.active()); // let it continue
   ```

## Timing note

`vt.active()` returns `document.activeViewTransition` — it is only non-null
**while a transition is in-flight** (typically 0.25–1s). If you call it at rest
it returns `undefined`. The trick is to type your command, press Enter the
instant you see the transition start, or use a breakpoint / `debugger`
statement wired to `pagereveal`.

For longer inspection windows, pause immediately:

```js
vt.pause(vt.active()); // freezes — now inspect at your leisure
```

## Reference

### Feature detection

```js
vt.supports; // { sameDocument, types, crossDocument, elementScoped, activeViewTransition }
```

### Active transition

```js
vt.active(); // ViewTransition | undefined — the current transition
vt.active()?.types; // Set of active transition types (e.g. "forward", "backward")
```

### Animations

```js
vt.getAnimations(vt); // all VT animations
vt.getAnimations(vt, 'hero-img'); // filtered by view-transition-name
vt.getAnimations(vt, ['hero-img', 'logo']); // multiple names
vt.getAnimations(vt, 'hero-img', vt.ViewTransitionPart.Group); // specific pseudo part
```

### Geometry

```js
vt.extractGeometry(animation); // { before: {…}, after: {…} } — width/height/left/top
```

### Playback control

```js
vt.pause(vt); // pause all VT animations
vt.resume(vt); // resume
vt.scrub(vt, 0.5); // scrub to 50% (auto-pauses)
```

### Optimization

Replaces width/height keyframes with transform-based animations for better
performance:

```js
vt.optimizeGroupAnimations(vt, '*'); // all groups, SCALE strategy
vt.optimizeGroupAnimations(vt, 'hero-img', vt.OPTIMIZATION_STRATEGY.SLIDE);
vt.optimizeAnimation(animation, geometry, vt.OPTIMIZATION_STRATEGY.SCALE);
```

Strategies: `vt.OPTIMIZATION_STRATEGY.NONE`, `.SLIDE`, `.SCALE` (default).

### Misc

```js
// Temporarily assign view-transition-name, cleaned up after the promise resolves
vt.setTemporaryViewTransitionNames([[el, 'my-name']], transition.finished);

// Extract the name from a pseudo-element selector
vt.extractViewTransitionName('::view-transition-new(hero-img)'); // 'hero-img'
```

## Browser support

| Browser     | `vt.active()` works? | Notes                                                                                            |
| ----------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| Chrome 125+ | Yes                  | `document.activeViewTransition` is native for both same-doc and cross-doc                        |
| Safari 18   | No                   | Cross-doc VT supported, but no native `activeViewTransition` — `vt.active()` returns `undefined` |
| Firefox     | Partial              | Same-doc only; no cross-doc VT                                                                   |

On unsupported browsers, existing transitions still run gracefully — they just
can't be inspected via `window.vt`. No shim or fallback is provided by design.

## Implementation

| File                                  | Purpose                                |
| ------------------------------------- | -------------------------------------- |
| `client/ts/view-transitions/debug.ts` | Attaches helpers to `window.vt`; inert |
| `client/ts/index.ts`                  | Side-effect import of the debug module |
| `package.json`                        | `view-transitions-toolkit` dependency  |

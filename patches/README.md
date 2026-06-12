# Shaders Library Patches

Patch for `shaders@2.5.130` — auto-applied on `npm install` via `patch-package`.

## What this patch changes

### 1. Remove viewport resolution cap (`core/index.js`)

The library's `clampToTextureCap()` function caps the shader render resolution to `window.innerWidth` × `window.innerHeight`. This prevents rendering at fixed dimensions larger than the viewport.

**Before:**

```js
const capW = Math.min(w, window.innerWidth, gpuCssCap);
const capH = Math.min(h, window.innerHeight, gpuCssCap);
```

**After:**

```js
const capW = Math.min(w, gpuCssCap);
const capH = Math.min(h, gpuCssCap);
```

**Why:** The hero shader uses a fixed 1200×622 render buffer so resolution stays consistent across screen sizes. Without this patch, mobile viewports would force the buffer down to the viewport width (e.g. 390px), causing blurry output.

### 2. Import reordering (cosmetic, from formatter)

`Form3D-DOek31CJ.js` and `core/index.js` have minor import statement reorderings and whitespace changes from code formatting. These are functionally neutral.

## Files modified

| File                      | Change                                                                         |
| ------------------------- | ------------------------------------------------------------------------------ |
| `core/index.js`           | Removed `window.innerWidth`/`window.innerHeight` caps from `clampToTextureCap` |
| `core/Form3D-DOek31CJ.js` | Import reorder only (cosmetic)                                                 |

## Managing this patch

- **Regenerate:** Edit `node_modules/shaders/`, then run `npx patch-package shaders`
- **Remove:** Delete `patches/shaders+2.5.130.patch` and remove `"postinstall": "patch-package"` from `package.json`
- **Upgrade:** After `npm install shaders@new-version`, reapply changes to the new files and regenerate the patch

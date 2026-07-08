#!/usr/bin/env node
/**
 * Resize a geo icon to fill the 34×34 viewBox edge-to-edge.
 * Lines are scaled/translated to touch the edges.
 * Circles keep their original diameter — only their centers move.
 * Stroke-width is preserved.
 *
 * Usage:
 *   node tools/resize-icon.js views/icons/geo/02.twig
 *   node tools/resize-icon.js --all   # process all 30 icons
 */

const fs = require('fs');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');
const geoDir = path.join(themeRoot, 'views/icons/geo');
const VIEWBOX = 34;

// ── Path tokenizer ───────────────────────────────────────────────

function tokenize(d) {
    return d
        .replace(/,/g, ' ')
        .replace(/([a-zA-Z])/g, ' $1 ')
        .split(/\s+/)
        .filter((t) => t.length > 0);
}

// ── Bounds from all path data ────────────────────────────────────

function getBounds(content) {
    const dMatches = [...content.matchAll(/\bd="([^"]*)"/g)].map((m) => m[1]);
    let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;

    for (const d of dMatches) {
        const tokens = tokenize(d);
        let x = 0,
            y = 0,
            sx = 0,
            sy = 0,
            i = 0;
        const nextNum = () => {
            while (i < tokens.length && /^[a-zA-Z]+$/.test(tokens[i])) i++;
            if (i >= tokens.length) return null;
            return parseFloat(tokens[i++]);
        };
        const visit = (nx, ny) => {
            x = nx;
            y = ny;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        };

        while (i < tokens.length) {
            let cmd = tokens[i];
            const rel = /^[a-z]/.test(cmd);
            cmd = cmd[0].toUpperCase();
            i++;
            if (cmd === 'M') {
                let nx = nextNum();
                if (nx === null) break;
                let ny = nextNum();
                if (ny === null) break;
                if (rel) {
                    nx += x;
                    ny += y;
                }
                visit(nx, ny);
                sx = x;
                sy = y;
                while (i < tokens.length && !/^[a-zA-Z]+$/.test(tokens[i])) {
                    nx = nextNum();
                    if (nx === null) break;
                    ny = nextNum();
                    if (ny === null) break;
                    if (rel) {
                        nx += x;
                        ny += y;
                    }
                    visit(nx, ny);
                }
            } else if (cmd === 'L') {
                let nx = nextNum();
                if (nx === null) break;
                let ny = nextNum();
                if (ny === null) break;
                if (rel) {
                    nx += x;
                    ny += y;
                }
                visit(nx, ny);
            } else if (cmd === 'H') {
                let nx = nextNum();
                if (nx === null) break;
                if (rel) nx += x;
                visit(nx, y);
            } else if (cmd === 'V') {
                let ny = nextNum();
                if (ny === null) break;
                if (rel) ny += y;
                visit(x, ny);
            } else if (cmd === 'C') {
                for (let p = 0; p < 3; p++) {
                    const cx = nextNum();
                    if (cx === null) break;
                    const cy = nextNum();
                    if (cy === null) break;
                    if (p === 2) {
                        let nx = cx,
                            ny = cy;
                        if (rel) {
                            nx += x;
                            ny += y;
                        }
                        visit(nx, ny);
                    }
                }
            } else if (cmd === 'Z') {
                visit(sx, sy);
            } else {
                while (i < tokens.length && !/^[a-zA-Z]+$/.test(tokens[i])) i++;
            }
        }
    }
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

// ── Circle path reconstruction ───────────────────────────────────

/**
 * Given a circle center and radius, generate a 4-segment cubic bezier path.
 * Uses the same control-point offset as the existing icons (~0.5523 × radius).
 */
function makeCirclePath(cx, cy, r) {
    const k = 0.5522847498 * r;
    const fmt = (v) => parseFloat(v.toFixed(3)).toString();
    // M top → C right → C bottom → C left → C top → Z
    return (
        `M${fmt(cx)} ${fmt(cy + r)}` +
        `C${fmt(cx + k)} ${fmt(cy + r)} ${fmt(cx + r)} ${fmt(cy + k)} ${fmt(cx + r)} ${fmt(cy)}` +
        `C${fmt(cx + r)} ${fmt(cy - k)} ${fmt(cx + k)} ${fmt(cy - r)} ${fmt(cx)} ${fmt(cy - r)}` +
        `C${fmt(cx - k)} ${fmt(cy - r)} ${fmt(cx - r)} ${fmt(cy - k)} ${fmt(cx - r)} ${fmt(cy)}` +
        `C${fmt(cx - r)} ${fmt(cy + k)} ${fmt(cx - k)} ${fmt(cy + r)} ${fmt(cx)} ${fmt(cy + r)}` +
        `Z`
    );
}

/**
 * Extract center and radius from a circle bezier path.
 * Assumes perfect circle: first M is (cx, cy+r), first C endpoint is (cx+r, cy).
 */
function getCircleCenter(d) {
    const tokens = tokenize(d);
    const nums = [];
    for (const t of tokens) {
        const n = parseFloat(t);
        if (!isNaN(n)) nums.push(n);
    }
    if (nums.length < 4) return null;
    const cx = nums[0];
    const topY = nums[1];
    // Find maxX among endpoints to get cx+r
    let maxX = -Infinity;
    let i = 0,
        x = 0,
        y = 0;
    const nextNum = () => {
        while (i < tokens.length && /^[a-zA-Z]+$/.test(tokens[i])) i++;
        if (i >= tokens.length) return null;
        return parseFloat(tokens[i++]);
    };
    while (i < tokens.length) {
        let cmd = tokens[i];
        const rel = /^[a-z]/.test(cmd);
        cmd = cmd[0].toUpperCase();
        i++;
        if (cmd === 'M') {
            x = nextNum();
            y = nextNum();
            if (rel) {
                x += x;
                y += y;
            }
        } else if (cmd === 'C') {
            for (let p = 0; p < 3; p++) {
                const cx1 = nextNum();
                const cy1 = nextNum();
                if (p === 2) {
                    let nx = cx1,
                        ny = cy1;
                    if (rel) {
                        nx += x;
                        ny += y;
                    }
                    x = nx;
                    y = ny;
                    if (x > maxX) maxX = x;
                }
            }
        }
    }
    const r = maxX - cx;
    if (r <= 0 || r > 20) return null;
    return { cx: (cx + (maxX - r)) / 2, cy: topY - r, r };
}

// ── Coordinate scaling ───────────────────────────────────────────

function scaleX(val, min, s, off) {
    return +((val - min) * s + off).toFixed(4);
}
function scaleY(val, min, s, off) {
    return +((val - min) * s + off).toFixed(4);
}

function transformLinePath(d, minX, minY, s, ox, oy) {
    const tokens = tokenize(d);
    const out = [];
    let i = 0,
        x = 0,
        y = 0;

    const nextNum = () => {
        while (i < tokens.length && /^[a-zA-Z]+$/.test(tokens[i])) out.push(tokens[i++]);
        if (i >= tokens.length) return null;
        return parseFloat(tokens[i++]);
    };
    const emit = (v) => out.push(parseFloat(v.toFixed(4)).toString());

    while (i < tokens.length) {
        let cmd = tokens[i];
        const rel = /^[a-z]/.test(cmd);
        const upper = cmd[0].toUpperCase();
        out.push(tokens[i]);
        i++;

        if (upper === 'M' || upper === 'L') {
            let nx = nextNum();
            if (nx === null) break;
            let ny = nextNum();
            if (ny === null) break;
            if (rel) {
                nx += x;
                ny += y;
            }
            nx = scaleX(nx, minX, s, ox);
            ny = scaleY(ny, minY, s, oy);
            if (rel) {
                nx -= x;
                ny -= y;
            }
            x = rel ? x + nx : nx;
            y = rel ? y + ny : ny;
            emit(nx);
            emit(ny);
            if (upper === 'M') {
                while (i < tokens.length && !/^[a-zA-Z]+$/.test(tokens[i])) {
                    nx = nextNum();
                    if (nx === null) break;
                    ny = nextNum();
                    if (ny === null) break;
                    if (rel) {
                        nx += x;
                        ny += y;
                    }
                    nx = scaleX(nx, minX, s, ox);
                    ny = scaleY(ny, minY, s, oy);
                    if (rel) {
                        nx -= x;
                        ny -= y;
                    }
                    x = rel ? x + nx : nx;
                    y = rel ? y + ny : ny;
                    emit(nx);
                    emit(ny);
                }
            }
        } else if (upper === 'H') {
            let nx = nextNum();
            if (nx === null) break;
            if (rel) nx += x;
            nx = scaleX(nx, minX, s, ox);
            if (rel) nx -= x;
            x = rel ? x + nx : nx;
            emit(nx);
        } else if (upper === 'V') {
            let ny = nextNum();
            if (ny === null) break;
            if (rel) ny += y;
            ny = scaleY(ny, minY, s, oy);
            if (rel) ny -= y;
            y = rel ? y + ny : ny;
            emit(ny);
        } else if (upper === 'C') {
            for (let p = 0; p < 3; p++) {
                const cx1 = nextNum();
                if (cx1 === null) break;
                const cy1 = nextNum();
                if (cy1 === null) break;
                let ax = cx1,
                    ay = cy1;
                if (rel) {
                    ax += x;
                    ay += y;
                }
                ax = scaleX(ax, minX, s, ox);
                ay = scaleY(ay, minY, s, oy);
                if (rel) {
                    ax -= x;
                    ay -= y;
                }
                emit(ax);
                emit(ay);
                if (p === 2) {
                    x = rel ? x + ax : ax;
                    y = rel ? y + ay : ay;
                }
            }
        } else {
            while (i < tokens.length && !/^[a-zA-Z]+$/.test(tokens[i])) i++;
        }
    }
    return out.join(' ');
}

// ── Main per-file transform ──────────────────────────────────────

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const name = path.basename(filePath, '.twig');

    // Remove any existing transform wrapper or clip-path artifacts
    content = content.replace(/[\t ]*<g transform="[^"]*">\n?/g, '');
    content = content.replace(/[\t ]*<\/g>\n?/g, '');
    content = content.replace(/\s+clip-path="url\([^)]*\)"/g, '');
    content = content.replace(/\s*<defs>\s*<clipPath[^>]*>[\s\S]*?<\/clipPath>\s*<\/defs>/g, '');

    // Find all d attributes
    const dMatches = [...content.matchAll(/\bd="([^"]*)"/g)];

    // Separate circles (fill) from lines (stroke)
    const circleEntries = [];
    const lineEntries = [];

    for (const dm of dMatches) {
        const d = dm[1];
        const dPos = dm.index;

        // Find the enclosing <path … /> element for accurate classification
        const before = content.lastIndexOf('<path', dPos);
        const after = content.indexOf('/>', dPos);
        const pathTag = before >= 0 && after > dPos ? content.slice(before, after + 2) : '';

        const isCircleFill = pathTag.includes('fill="#113768"');
        const isStroke = pathTag.includes('stroke=');

        if (isCircleFill && !isStroke) {
            const info = getCircleCenter(d);
            if (info) circleEntries.push({ match: dm[0], pos: dPos, d, ...info });
        } else if (isStroke && !isCircleFill) {
            lineEntries.push({ match: dm[0], pos: dPos, d });
        }
    }

    // Compute bounds from ALL content
    const bounds = getBounds(content);

    // Handle case where bounds already fill the viewBox
    if (bounds.width >= VIEWBOX - 1 && bounds.height >= VIEWBOX - 1) {
        console.log(`  ${name.padEnd(6)} already fills viewBox — skip`);
        return false;
    }

    const s = VIEWBOX / Math.max(bounds.width, bounds.height);
    const ox = +(VIEWBOX - bounds.width * s).toFixed(4) / 2;
    const oy = +(VIEWBOX - bounds.height * s).toFixed(4) / 2;

    // Transform line paths
    const replacements = [];
    for (const le of lineEntries) {
        const newD = transformLinePath(le.d, bounds.minX, bounds.minY, s, ox, oy);
        replacements.push({ old: le.match, new: 'd="' + newD + '"' });
    }

    // Transform circle paths: move center, keep radius
    for (const ce of circleEntries) {
        const newCx = scaleX(ce.cx, bounds.minX, s, ox);
        const newCy = scaleY(ce.cy, bounds.minY, s, oy);
        const newD = makeCirclePath(newCx, newCy, ce.r);
        replacements.push({ old: ce.match, new: 'd="' + newD + '"' });
    }

    // Apply replacements (sort by position descending to preserve indices)
    replacements.sort((a, b) => content.indexOf(b.old) - content.indexOf(a.old));
    for (const r of replacements) {
        content = content.replace(r.old, r.new);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(
        `  ${name.padEnd(6)} ${bounds.width.toFixed(1)}×${bounds.height.toFixed(1)} → ${((s - 1) * 100).toFixed(0)}%`
    );
    return true;
}

// ── CLI ──────────────────────────────────────────────────────────

const arg = process.argv[2];

if (arg === '--all') {
    const files = fs
        .readdirSync(geoDir)
        .filter((f) => f.endsWith('.twig'))
        .sort();
    let n = 0;
    console.log('\n  Resizing all geo icons to fill viewBox\n  ' + '─'.repeat(50));
    for (const f of files) {
        if (processFile(path.join(geoDir, f))) n++;
    }
    console.log('  ' + '─'.repeat(50));
    console.log(`  ✓ ${n} icons resized\n`);
} else if (arg) {
    console.log('');
    processFile(arg);
    console.log('');
} else {
    console.error('Usage: node tools/resize-icon.js <file.twig> | --all');
    process.exit(1);
}

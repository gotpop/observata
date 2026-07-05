#!/usr/bin/env node
/**
 * Sync SVG sphere exports from Twig templates.
 *
 * Reads every sphere Twig file in views/graphics/spheres/,
 * extracts the inner <svg> markup, and writes a standalone
 * .svg export to assets/svg/spheres/.
 *
 * The .svg files are standalone references that keep inline
 * attributes (fill, stroke, stroke-width) since they don't
 * load the theme's CSS token system.
 *
 * Usage:
 *   node tools/sync-sphere-svgs.js          # sync all
 *   node tools/sync-sphere-svgs.js --check   # verify sync without writing
 *
 * @see .github/instructions/svg-spheres.instructions.md
 */

const fs = require('fs');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');
const twigDir = path.join(themeRoot, 'views/graphics/spheres');
const svgDir = path.join(themeRoot, 'assets/svg/spheres');

const checkOnly = process.argv.includes('--check');

// Resolve to theme root for consistent path display
const rel = (p) => path.relative(themeRoot, p);

/**
 * Extract the <svg>…</svg> block from a Twig file,
 * stripping the <graphic-sphere> wrapper and removing
 * one level of indentation (the wrapper's tab).
 */
function extractSvg(twigContent) {
    const svgMatch = twigContent.match(/<svg[\s\S]*<\/svg>/);
    if (!svgMatch) return null;

    const lines = svgMatch[0].split('\n');
    const dedented = lines.map((line) => {
        if (line.startsWith('\t')) return line.slice(1);
        return line;
    });

    return '<?xml version="1.0" encoding="UTF-8"?>\n' + dedented.join('\n') + '\n';
}

/**
 * Count key SVG elements for verification.
 */
function countElements(content) {
    return {
        svg: (content.match(/<svg/g) || []).length,
        path: (content.match(/<path/g) || []).length,
        circle: (content.match(/<circle/g) || []).length,
        g: (content.match(/<g/g) || []).length,
        defs: (content.match(/<defs/g) || []).length,
    };
}

// Ensure output directory exists
if (!checkOnly) {
    fs.mkdirSync(svgDir, { recursive: true });
}

const twigFiles = fs
    .readdirSync(twigDir)
    .filter((f) => f.endsWith('.twig'))
    .sort();

let synced = 0;
let mismatches = 0;
let skipped = 0;

console.log('');
console.log('  Sphere Twig → SVG sync');
console.log('  ' + '─'.repeat(66));
console.log(
    '  ' +
    'sphere'.padEnd(22) +
    'twig(svg/path/circ/g)'.padEnd(22) +
    'svg(svg/path/circ/g)'.padEnd(22) +
    'status'
);

for (const twigFile of twigFiles) {
    const twigPath = path.join(twigDir, twigFile);
    const twigContent = fs.readFileSync(twigPath, 'utf8');
    const twigSvg = twigContent.match(/<svg[\s\S]*<\/svg>/);

    const svgFileName = twigFile.replace('.twig', '.svg');
    const svgPath = path.join(svgDir, svgFileName);
    const name = twigFile.replace('.twig', '');

    const twigCounts = twigSvg ? countElements(twigSvg[0]) : { svg: 0, path: 0, circle: 0, g: 0, defs: 0 };

    if (!twigSvg) {
        console.log('  ' + name.padEnd(22) + '— no <svg> found, skipping');
        skipped++;
        continue;
    }

    // Check existing SVG if in --check mode
    if (checkOnly) {
        if (!fs.existsSync(svgPath)) {
            console.log(
                '  ' +
                name.padEnd(22) +
                '— MISSING ' + rel(svgPath)
            );
            mismatches++;
            continue;
        }

        const existingSvg = fs.readFileSync(svgPath, 'utf8');
        const svgCounts = countElements(existingSvg);
        const tStr =
            twigCounts.svg + '/' + twigCounts.path + '/' + twigCounts.circle + '/' + twigCounts.g;
        const sStr =
            svgCounts.svg + '/' + svgCounts.path + '/' + svgCounts.circle + '/' + svgCounts.g;

        const match =
            twigCounts.svg === svgCounts.svg &&
            twigCounts.path === svgCounts.path &&
            twigCounts.circle === svgCounts.circle &&
            twigCounts.g === svgCounts.g;

        if (!match) mismatches++;

        console.log(
            '  ' +
            name.padEnd(22) +
            tStr.padEnd(22) +
            sStr.padEnd(22) +
            (match ? 'OK' : 'MISMATCH')
        );
        continue;
    }

    // Write SVG export
    const svgOutput = extractSvg(twigContent);
    fs.writeFileSync(svgPath, svgOutput, 'utf8');
    synced++;

    const svgCounts = countElements(svgOutput);
    const tStr =
        twigCounts.svg + '/' + twigCounts.path + '/' + twigCounts.circle + '/' + twigCounts.g;
    const sStr =
        svgCounts.svg + '/' + svgCounts.path + '/' + svgCounts.circle + '/' + svgCounts.g;

    console.log(
        '  ' +
        name.padEnd(22) +
        tStr.padEnd(22) +
        sStr.padEnd(22) +
        'synced'
    );
}

console.log('  ' + '─'.repeat(66));

if (checkOnly) {
    if (mismatches === 0) {
        console.log('  ✓ All ' + twigFiles.length + ' SVG files in sync');
    } else {
        console.log(
            '  ✗ ' + mismatches + ' of ' + twigFiles.length + ' files out of sync — run: npm run sync:svgs'
        );
        process.exit(1);
    }
} else {
    console.log('  ✓ Synced ' + synced + ' SVG files to ' + rel(svgDir) + '/');
    if (skipped > 0) console.log('  ⚠ Skipped ' + skipped + ' files (no <svg> found)');
}
console.log('');

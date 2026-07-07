#!/usr/bin/env node
/**
 * Sync SVG icon exports from Twig templates.
 *
 * Reads every icon Twig file in views/icons/{geo,lucide,platform}/,
 * extracts the inner <svg> markup, and writes a standalone
 * .svg export to assets/svg/icons/<category>/<name>.svg.
 *
 * Icon Twig files use custom-element wrappers:
 *   <icon-geo>       — geometric icons
 *   <icon-lucide>    — Lucide UI icons
 *   <icon-platform>  — platform/brand icons
 *
 * The .svg files are standalone references that keep inline
 * attributes (fill, stroke, stroke-width) since they don't
 * load the theme's CSS token system.
 *
 * Usage:
 *   node tools/sync-icon-svgs.js          # sync all
 *   node tools/sync-icon-svgs.js --check   # verify sync without writing
 *
 * @see .github/instructions/svg-icons.instructions.md
 */

const fs = require('fs');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');
const twigIconsRoot = path.join(themeRoot, 'views/icons');
const svgIconsRoot = path.join(themeRoot, 'assets/svg/icons');

const checkOnly = process.argv.includes('--check');

// Resolve to theme root for consistent path display
const rel = (p) => path.relative(themeRoot, p);

// Icon categories (subdirectories under views/icons/)
const CATEGORIES = ['geo', 'lucide', 'platform'];

/**
 * Extract the <svg>…</svg> block from a Twig file,
 * stripping the custom-element wrapper, removing
 * one level of indentation (the wrapper's tab),
 * and adding xmlns for standalone rendering (required when
 * loaded via <img> tag — inline HTML5 SVGs inherit the namespace).
 */
function extractSvg(twigContent) {
	const svgMatch = twigContent.match(/<svg[\s\S]*<\/svg>/);
	if (!svgMatch) return null;

	// Add xmlns for standalone SVG rendering (e.g. <img src="...">).
	// Inline SVGs in HTML5 don't need it, but standalone .svg files do.
	let svgContent = svgMatch[0];
	if (!svgContent.includes('xmlns=')) {
		svgContent = svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
	}

	const lines = svgContent.split('\n');
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
		rect: (content.match(/<rect/g) || []).length,
		g: (content.match(/<g/g) || []).length,
		defs: (content.match(/<defs/g) || []).length,
	};
}

// Ensure output directories exist
if (!checkOnly) {
	for (const cat of CATEGORIES) {
		fs.mkdirSync(path.join(svgIconsRoot, cat), { recursive: true });
	}
}

let totalSynced = 0;
let totalMismatches = 0;
let totalSkipped = 0;
let totalFiles = 0;

console.log('');
console.log('  Icon Twig → SVG sync');
console.log('  ' + '─'.repeat(66));

for (const category of CATEGORIES) {
	const twigDir = path.join(twigIconsRoot, category);
	const svgDir = path.join(svgIconsRoot, category);

	if (!fs.existsSync(twigDir)) {
		console.log('  [skip] ' + category + '/ — directory not found');
		continue;
	}

	const twigFiles = fs
		.readdirSync(twigDir)
		.filter((f) => f.endsWith('.twig'))
		.sort();

	totalFiles += twigFiles.length;

	console.log('');
	console.log('  [' + category + '/]');

	for (const twigFile of twigFiles) {
		const twigPath = path.join(twigDir, twigFile);
		const twigContent = fs.readFileSync(twigPath, 'utf8');
		const twigSvg = twigContent.match(/<svg[\s\S]*<\/svg>/);

		const svgFileName = twigFile.replace('.twig', '.svg');
		const svgPath = path.join(svgDir, svgFileName);
		const name = twigFile.replace('.twig', '');

		const twigCounts = twigSvg
			? countElements(twigSvg[0])
			: { svg: 0, path: 0, circle: 0, rect: 0, g: 0, defs: 0 };

		if (!twigSvg) {
			console.log('    ' + name.padEnd(20) + '— no <svg> found, skipping');
			totalSkipped++;
			continue;
		}

		// Build element-count signature for comparison
		const sig = (c) =>
			c.svg + '/' + c.path + '/' + c.circle + '/' + c.rect + '/' + c.g + '/' + c.defs;

		if (checkOnly) {
			if (!fs.existsSync(svgPath)) {
				console.log('    ' + name.padEnd(20) + '— MISSING ' + rel(svgPath));
				totalMismatches++;
				continue;
			}

			const existingSvg = fs.readFileSync(svgPath, 'utf8');
			const svgCounts = countElements(existingSvg);
			const match = sig(twigCounts) === sig(svgCounts);

			if (!match) totalMismatches++;

			console.log(
				'    ' + name.padEnd(20) + sig(twigCounts).padEnd(24) + (match ? 'OK' : 'MISMATCH')
			);
			continue;
		}

		// Write SVG export
		const svgOutput = extractSvg(twigContent);
		fs.writeFileSync(svgPath, svgOutput, 'utf8');
		totalSynced++;

		const svgCounts = countElements(svgOutput);
		console.log('    ' + name.padEnd(20) + sig(twigCounts).padEnd(24) + 'synced');
	}
}

console.log('  ' + '─'.repeat(66));

if (checkOnly) {
	if (totalMismatches === 0) {
		console.log('  ✓ All ' + totalFiles + ' icon SVG files in sync');
	} else {
		console.log(
			'  ✗ ' +
			totalMismatches +
			' of ' +
			totalFiles +
			' files out of sync — run: npm run sync:icons'
		);
		process.exit(1);
	}
} else {
	console.log(
		'  ✓ Synced ' + totalSynced + ' SVG files across ' + CATEGORIES.length + ' categories'
	);
	if (totalSkipped > 0) console.log('  ⚠ Skipped ' + totalSkipped + ' files (no <svg> found)');
}
console.log('');

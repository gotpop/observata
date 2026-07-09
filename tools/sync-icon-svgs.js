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
 * Resolve a Twig wrapper file to the actual template content.
 * If the file is a thin wrapper (only contains an include statement),
 * follow it to the real template. Resolves paths relative to theme root,
 * blocks/, or views/ (matching Timber loader behaviour).
 */
function resolveWrapper(twigDir, content) {
	const includeMatch = content.trim().match(/^\{%\s*include\s+'([^']+)'\s*%\}\s*$/m);
	if (!includeMatch) return null;

	const includePath = includeMatch[1];
	// Timber resolves from theme root, blocks/, views/
	const bases = [
		path.join(themeRoot), // theme root
		path.join(themeRoot, 'blocks'),
		path.join(themeRoot, 'views'),
	];

	for (const base of bases) {
		const resolved = path.join(base, includePath);
		if (fs.existsSync(resolved)) {
			return fs.readFileSync(resolved, 'utf8');
		}
	}
	return null;
}

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

/**
 * Recursively collect all .twig files from a directory and its subdirectories.
 * Returns array of absolute paths.
 */
function collectTwigs(dir) {
	const results = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...collectTwigs(fullPath));
		} else if (entry.isFile() && entry.name.endsWith('.twig')) {
			results.push(fullPath);
		}
	}
	return results;
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

	const twigFiles = collectTwigs(twigDir).sort();
	const nameMap = new Map(); // baseName → { twigPath, subdir }

	for (const twigPath of twigFiles) {
		const baseName = path.basename(twigPath).replace('.twig', '');
		const subdir = path.relative(twigDir, path.dirname(twigPath));
		// Precedence: medium/ > other subdirs > top-level
		// Medium variants are the canonical export; other subdirs
		// and top-level are fallbacks.
		const existing = nameMap.get(baseName);
		const priority = (s) => {
			if (s === '.') return 0;
			if (s.includes('medium')) return 2;
			return 1;
		};
		if (!existing || priority(subdir) > priority(existing.subdir)) {
			nameMap.set(baseName, { twigPath, subdir });
		}
	}

	totalFiles += nameMap.size;

	console.log('');
	console.log('  [' + category + '/]');

	for (const [name, { twigPath, subdir }] of nameMap) {
		let twigContent = fs.readFileSync(twigPath, 'utf8');
		let twigSvg = twigContent.match(/<svg[\s\S]*<\/svg>/);

		const svgFileName = name + '.svg';
		const svgPath = path.join(svgDir, svgFileName);

		// If this is a wrapper file (no <svg>), resolve to the real template
		if (!twigSvg) {
			const resolved = resolveWrapper(twigDir, twigContent);
			if (resolved) {
				twigContent = resolved;
				twigSvg = twigContent.match(/<svg[\s\S]*<\/svg>/);
			}
		}

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

		const sourceTag = subdir === '.' ? ' ' : '←' + subdir;

		if (checkOnly) {
			if (!fs.existsSync(svgPath)) {
				console.log('    ' + name.padEnd(20) + sourceTag.padEnd(4) + '— MISSING ' + rel(svgPath));
				totalMismatches++;
				continue;
			}

			const existingSvg = fs.readFileSync(svgPath, 'utf8');
			const svgCounts = countElements(existingSvg);
			const match = sig(twigCounts) === sig(svgCounts);

			if (!match) totalMismatches++;

			console.log(
				'    ' +
					name.padEnd(20) +
					sourceTag.padEnd(4) +
					sig(twigCounts).padEnd(24) +
					(match ? 'OK' : 'MISMATCH')
			);
			continue;
		}

		// Write SVG export
		const svgOutput = extractSvg(twigContent);
		fs.writeFileSync(svgPath, svgOutput, 'utf8');
		totalSynced++;

		const svgCounts = countElements(svgOutput);
		console.log(
			'    ' + name.padEnd(20) + sourceTag.padEnd(4) + sig(twigCounts).padEnd(24) + 'synced'
		);
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

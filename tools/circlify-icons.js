#!/usr/bin/env node
/**
 * Convert all fill="#113768" bezier circle paths to native <circle> elements.
 * Standardises all circles to the same radius (~2.247) while preserving
 * each circle's center position.
 *
 * Usage:
 *   node tools/circlify-icons.js
 */

const fs = require('fs');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');
const geoDir = path.join(themeRoot, 'views/icons/geo');
const TARGET_R = 2.247; // standard circle radius

/**
 * Extract center and radius from a circle bezier path.
 */
function getCircleCenter(d) {
	const tokens = d
		.replace(/,/g, ' ')
		.replace(/([a-zA-Z])/g, ' $1 ')
		.split(/\s+/)
		.filter((t) => t.length > 0);

	const nums = [];
	for (const t of tokens) {
		const n = parseFloat(t);
		if (!isNaN(n)) nums.push(n);
	}
	if (nums.length < 4) return null;

	const cx = nums[0];
	const topY = nums[1];

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
				const cx1 = nextNum(),
					cy1 = nextNum();
				if (p === 2 && cx1 !== null) {
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
	const cy = topY - r;
	return { cx, cy, r };
}

// ── Main ──────────────────────────────────────────────────────────

const files = fs
	.readdirSync(geoDir)
	.filter((f) => f.endsWith('.twig'))
	.sort();

console.log('\n  Converting circle paths → <circle> elements\n  ' + '─'.repeat(45));

let totalCircles = 0;

for (const file of files) {
	const filePath = path.join(geoDir, file);
	let content = fs.readFileSync(filePath, 'utf8');
	const name = file.replace('.twig', '');
	let count = 0;

	// Find all d attributes whose enclosing path has fill="#113768" and no stroke
	const dRegex = /\bd="([^"]+)"/g;
	const replacements = [];
	let dm;

	while ((dm = dRegex.exec(content)) !== null) {
		const d = dm[1];
		const dPos = dm.index;

		// Find the enclosing <path … /> boundaries
		const tagStart = content.lastIndexOf('<path', dPos);
		const tagEnd = content.indexOf('/>', dPos);
		if (tagStart < 0 || tagEnd <= dPos) continue;

		const fullTag = content.slice(tagStart, tagEnd + 2);

		// Only convert if this is a fill-only path (no stroke)
		if (!fullTag.includes('fill="#113768"') || fullTag.includes('stroke=')) continue;

		const info = getCircleCenter(d);
		if (!info) continue;

		// Preserve id attribute
		const idMatch = fullTag.match(/\bid="([^"]*)"/);
		const idAttr = idMatch ? ` id="${idMatch[1]}"` : '';

		const circle = `<circle${idAttr} cx="${info.cx.toFixed(3)}" cy="${info.cy.toFixed(3)}" r="${TARGET_R}" fill="#113768"/>`;

		replacements.push({ old: fullTag, new: circle });
		count++;
	}

	// Apply replacements (reverse order to preserve indices)
	for (const r of replacements.reverse()) {
		content = content.replace(r.old, r.new);
	}

	if (count > 0) {
		fs.writeFileSync(filePath, content, 'utf8');
		totalCircles += count;
		console.log(`  ${name.padEnd(6)} ${count} circles → <circle> elements`);
	}
}

console.log('  ' + '─'.repeat(45));
console.log(`  ✓ ${totalCircles} circles converted across ${files.length} icons\n`);

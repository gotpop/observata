#!/usr/bin/env node
/**
 * Scale large geo icons from 34x34 to 54x54 viewBox.
 * Positions are scaled; stroke-width and circle radius are preserved.
 * Adds icon-geo--large class to the wrapper.
 */

const fs = require('fs');
const path = require('path');

const themeRoot = path.resolve(__dirname, '..');
const scale = 54 / 34;
const dirs = [
    'views/icons/geo/circles/large',
    'views/icons/geo/squares/large',
];

dirs.forEach((dir) => {
    const fullDir = path.join(themeRoot, dir);
    const files = fs.readdirSync(fullDir).filter((f) => f.endsWith('.twig'));
    files.forEach((f) => {
        const filePath = path.join(fullDir, f);
        let content = fs.readFileSync(filePath, 'utf8');

        // 1. Change viewBox
        content = content.replace(/viewBox="0 0 34 34"/g, 'viewBox="0 0 54 54"');

        // 2. Add class to wrapper
        content = content.replace(
            /<icon-geo class="icon-geo"/g,
            '<icon-geo class="icon-geo icon-geo--large"'
        );

        // 3. Scale path data (coordinate pairs in d="...")
        content = content.replace(/\bd="([^"]*)"/g, (match, d) => {
            const scaled = d.replace(/(\d+\.?\d*)/g, (num) => {
                return (parseFloat(num) * scale)
                    .toFixed(4)
                    .replace(/\.?0+$/, '');
            });
            return `d="${scaled}"`;
        });

        // 4. Scale cx and cy (but NOT r — radius stays 2.247)
        content = content.replace(/cx="([^"]*)"/g, (match, val) => {
            return `cx="${(parseFloat(val) * scale)
                .toFixed(4)
                .replace(/\.?0+$/, '')}"`;
        });
        content = content.replace(/cy="([^"]*)"/g, (match, val) => {
            return `cy="${(parseFloat(val) * scale)
                .toFixed(4)
                .replace(/\.?0+$/, '')}"`;
        });

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  scaled ${f}`);
    });
});

console.log('done');

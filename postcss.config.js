/**
 * PostCSS configuration.
 *
 * Takes over from @wordpress/scripts' built-in PostCSS config so we can
 * disable postcss-calc inside cssnano — it cannot parse relative color
 * syntax channel keywords (e.g. `l`, `c`, `h` in `oklch(from … calc(l - 0.02) c h)`),
 * producing harmless but noisy lexical-error warnings.
 */
const postcssPlugins = require('@wordpress/postcss-plugins-preset');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	plugins: [
		...postcssPlugins,
		...(isProduction
			? [
					require('cssnano')({
						preset: [
							'default',
							{
								discardComments: { removeAll: true },
								calc: false,
							},
						],
					}),
				]
			: []),
	],
};

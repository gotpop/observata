const defaultConfig = require('@wordpress/scripts/config/webpack.config');

// Override css-loader to NOT process url() references for fonts.
// Font files stay in assets/fonts/ and are referenced by the browser directly.
// Without this, css-loader tries to emit font files to build/fonts/ but fails
// to resolve the relative paths in the @import chain.
const cssRule = defaultConfig.module.rules.find(
	(rule) => rule.test && rule.test.toString().includes('\\.css')
);

if (cssRule) {
	const cssLoader = cssRule.use.find(
		(loader) => loader.loader && loader.loader.includes('css-loader')
	);
	if (cssLoader) {
		cssLoader.options = {
			...cssLoader.options,
			url: {
				filter: (url) => !url.match(/\.(woff2?|eot|ttf|otf)$/i),
			},
		};
	}
}

module.exports = {
	...defaultConfig,
	output: {
		...defaultConfig.output,
		publicPath: 'auto',
	},
	entry: async () => {
		const defaultEntries =
			typeof defaultConfig.entry === 'function' ? await defaultConfig.entry() : defaultConfig.entry;
		return {
			...defaultEntries,
			client: './client/ts/index.ts',
			home: './client/ts/home.ts',
			'style-global': './client/css/index.css',
			'unsplash-sidebar': './src/unsplash-sidebar/index.tsx',
		};
	},
	optimization: {
		...defaultConfig.optimization,
		// Single runtime chunk shared by all entry points — manages chunk loading.
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				// Extract three.js + shaders library into a shared vendor chunk
				// so it's only downloaded once, regardless of which entry point
				// needs it.
				vendor: {
					test: /[\\/]node_modules[\\/](three|shaders)[\\/]/,
					name: 'vendors',
					chunks: 'all',
					priority: 10,
				},
			},
		},
	},
};

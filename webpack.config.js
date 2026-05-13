const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: async () => {
        const defaultEntries = typeof defaultConfig.entry === 'function'
            ? await defaultConfig.entry()
            : defaultConfig.entry;
        return {
            ...defaultEntries,
            client: './client/ts/index.ts',
            'unsplash-sidebar': './src/unsplash-sidebar/index.tsx',
        };
    },
};

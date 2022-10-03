const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path');

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
    module: {
        rules,
    },
    plugins: plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@stylesheets': path.resolve(__dirname, './src/stylesheets'),
            '@model': path.resolve(__dirname, './src/model'),
            '@utils': path.resolve(__dirname, './src/utils'),
        },
    },
};

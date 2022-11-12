const path = require('path');
const webpack = require("webpack");

module.exports = {
    entry: './js/triangle-draw.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, ''),
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: require.resolve('jquery'),
            jQuery: require.resolve('jquery')
        }),
    ],
};

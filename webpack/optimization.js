const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');

module.exports = function(config) {
    config.entry.vendor = './src/vendor.js';

    config.output.filename = '[name].[chunkhash].js';

    config.plugins.push(
        new WebpackMd5Hash(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                dead_code: true, // eslint-disable-line camelcase
                screw_ie8: true, // eslint-disable-line camelcase
                unused: true,
                warnings: false
            }
        })
    );
}
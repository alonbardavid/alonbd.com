const webpack = require('webpack');

module.exports = function(config){
    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || 3000;
    config.devtool = 'source-map';

    config.entry.main.unshift(
        `webpack-dev-server/client?http://${HOST}:${PORT}`,
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        'babel-polyfill'
    );

    config.devServer = {
        contentBase: './src',
        historyApiFallback: true,
        host: HOST,
        hot: true,
        port: PORT,
        publicPath: "/",
        stats: {
            cached: true,
            cachedAssets: true,
            chunks: true,
            chunkModules: false,
            colors: true,
            hash: false,
            reasons: true,
            timings: true,
            version: false
        }
    };
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
};
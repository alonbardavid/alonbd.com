const path = require('path');
const webpack = require('webpack');

const config = module.exports = {
    context: path.resolve('./src'),
    entry: {
        entry: ['./entry.js']
    },
    module: {
        loaders:[]
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./target'),
        chunkFilename:"[name].[chunkhash].js",
        publicPath: '/',
        libraryTarget:"umd"
    },
    plugins: [],
    resolve: {
        extensions: [''],
        modulesDirectories: ['node_modules'],
        root: path.resolve('.'),
        alias: {}
    }
};
config.plugins.push(
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    })
)

require('./webpack/scripts')(config);
require('./webpack/stylesheets')(config);
require('./webpack/static')(config);
if (process.env.NODE_ENV == "development") {
    require('./webpack/development')(config);
}
if (process.env.BUILD_TASK == "profile" ) {
    require('./webpack/profile')(config);
}

if (process.env.NODE_ENV == "production") {
    config.devtool = 'source-map';
    require('./webpack/optimization')(config);
}
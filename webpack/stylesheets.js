const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config){
    var loader;
    if (process.env.BUILD_TASK == "build" || process.env.NODE_ENV == "production" ){
        loader ={test: /\.scss$/, loader: ExtractTextPlugin.extract('css?-autoprefixer!postcss!sass')};
        config.plugins.push( new ExtractTextPlugin('[name].[contenthash].css'))
    } else {
        loader = {test: /\.scss$/, loader: 'style!css!postcss!sass'};
    }
    config.module.loaders.push(loader);
    config.postcss = [
        autoprefixer({ browsers: ['last 3 versions'] })
    ];
    config.sassLoader = {
        outputStyle: 'compressed',
        precision: 10,
        sourceComments: false
    };


};
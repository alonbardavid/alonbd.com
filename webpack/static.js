const HtmlWebPackGenerateStaticPlugin = require('../html-webpack-generate-static-plugin');

module.exports = function(config){
    var meta = require('../src/metadata');
    var pages = Object.keys(meta.pages).map(function(p){
        return {
            path:p,
            include:["pages/" + p]
        }
    });
    if (process.env.NODE_ENV == "production") {
        config.plugins.push(
            new HtmlWebPackGenerateStaticPlugin({
                routes: pages
            })
        );
    }
    config.module.loaders.push(
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader' }
    );
    config.module.loaders.push(
        { test: /\.(md)$/, loaders: ["babel","../../markdown-it-react-loader"] }
    );
};
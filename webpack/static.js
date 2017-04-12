const HtmlWebPackGenerateStaticPlugin = require('../html-webpack-generate-static-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin= require('copy-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = function(config){
    configBinaryFiles(config);
    configMarkdown(config);
    configHtmlTemplate(config);
    if (process.env.BUILD_TASK == "build") {
        configStaticGeneration(config);
    }
};
function configBinaryFiles(config){
    config.module.loaders.push(
        {test: /\.(woff|eot|ttf|svg)$/, include:/fonts/,loader: 'file-loader?name=[path][name].[hash].[ext]' },
        {test: /\.(woff2)$/, loader: 'url-loader' },
        {test: /\.(jpg|png)/,loader:'file-loader?name=[path][name].[hash].[ext]'},
        {test: /\.svg/,exclude:/fonts/, loader:'raw-loader'}
    );
    config.plugins.push(
        new CopyWebpackPlugin([{from:'img/blog/**.*'}])
    )
}
function configMarkdown(config){
    config.resolve.extensions.push('.md');
    config.module.loaders.push(
        { test: /\.(md)$/, loaders: ["babel","../../markdown-it-react-loader"] }
    );
}

function configHtmlTemplate(config){
    config.plugins.push(
        new HtmlWebpackPlugin({
            filename:"./index.html",
            excludeChunks: ['server'],
            chunkSortMode: 'dependency',
            hash: false,
            inject: 'body',
            template: './index.html'
        })
    );
    config.plugins.push(
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        })
    )
}
function configStaticGeneration(config ){
    config.entry['server'] = ['./server-entry.js'];
    var meta = require('../src/metadata');
    var pages = Object.keys(meta.pages).map(function(p){
        if (p == "index"){
            return {path:p}
        }
        return {
            path:p,
            include:["pages/" + p]
        }
    });
    config.plugins.push(
        new HtmlWebPackGenerateStaticPlugin({
            routes: pages,
            exclude:['entry']
        })
    );
}
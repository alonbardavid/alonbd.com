module.exports = function(config){
    config.module.loaders.push(
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader' }
    );
};
module.exports = function(config){
    //webpack-bundle-size-analyzer doesn't work with uglify-plugin, we must use a loader to get minimized profile
    config.module.loaders.push(
        { test: /\.js$/, include:/node_modules/, loader: 'uglify' }
    );
};
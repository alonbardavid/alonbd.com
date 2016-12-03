module.exports = function(config){
    config.resolve.extensions.push('.js');
    config.module.loaders.push(
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
    );
    config.resolve.alias['react'] = 'preact-compat';
    config.resolve.alias['react-dom'] = 'preact-compat';
};
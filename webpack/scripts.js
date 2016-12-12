module.exports = function(config){
    config.resolve.extensions.push('.js');
    config.module.loaders.push(
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
    );
    config.resolve.alias['react'] = 'inferno-compat';
    config.resolve.alias['react-dom'] = 'inferno-compat';
    config.resolve.alias['inferno-compat/server'] = 'inferno-server';

};
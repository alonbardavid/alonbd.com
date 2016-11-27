module.exports = function(config){
    config.module.loaders.push(
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
    );
};
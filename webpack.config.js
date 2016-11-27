const path = require('path');
const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebPackGenerateStaticPlugin = require('./html-webpack-generate-static-plugin');
const config = module.exports = {
  entry: {
    main:[]
  },
  module: {
    loaders:[]
  },
  output: {},
  plugins: []
};
require('./webpack/scripts')(config);
require('./webpack/stylesheets')(config);
require('./webpack/static')(config);
if (process.env.NODE_ENV == "development") {
  require('./webpack/development')(config);
}
if (process.env.BUILD_TASK == "profile" ) {
    require('./webpack/profile')(config);
}
config.resolve = {
  extensions: ['', '.js'],
  modulesDirectories: ['node_modules'],
  root: path.resolve('.'),
  alias: {
    'react': 'preact-compat',
    'react-dom': 'preact-compat'
  }
};
config.entry = {
  main: ['./src/main.js']
};

config.output = {
  filename: '[name].js',
  path: path.resolve('./target'),
  publicPath: '/',
  libraryTarget:"umd"
};

config.plugins.push(
  new HtmlWebpackPlugin({
    filename:"/index.html",
    chunkSortMode: 'dependency',
    hash: false,
    inject: 'body',
    template: './src/index.html'
  })
);
config.plugins.push(
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    })
)
config.plugins.push(
    new HtmlWebPackGenerateStaticPlugin({
        routes: ['/','/about/','/about2/']
    })
);


if (process.env.NODE_ENV == "production") {
  config.devtool = 'source-map';

  config.entry.vendor = './src/vendor.js';

  config.output.filename = '[name].[chunkhash].js';

  config.plugins.push(
    new WebpackMd5Hash(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.optimize.DedupePlugin()
    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: true,
    //   compress: {
    //     dead_code: true, // eslint-disable-line camelcase
    //     screw_ie8: true, // eslint-disable-line camelcase
    //     unused: true,
    //     warnings: false
    //   }
    // })
  );
}
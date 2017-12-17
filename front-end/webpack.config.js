var path = require('path');
var config = {
  entry: path.resolve(__dirname, 'Entry.jsx'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
  		test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
  		loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015'] 
      }
	 }]
  }
};

module.exports = config;

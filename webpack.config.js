const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: 'main.js',
    path: path.resolve(_dirname, 'dist'),
  },
  devtool: 'inline-source-map'
};

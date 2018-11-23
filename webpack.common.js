const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const browserify = require('browserify');
const path = require('path');
const fs = require('fs');

const webpack_config = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: 'jSelection.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    // new HtmlWebpackPlugin({
    //   title: 'X-Selection',
    // }),
    new webpack.ProgressPlugin(function(percentage, msg) {
      if (0 === percentage) {
        console.log('Build started... Good luck!');
      } else if (1 === percentage) {
        _browserify(path.join('dist', 'jSelection.js'));
      }
    }),
  ],
};

const _browserify = function(filename) {
  let outputName = filename.replace(/\.[^/.]+$/, '');
  outputName = `${outputName}.browser.js`;
  console.log('Creating browser version ...');

  let b = browserify(filename, {
    standalone: 'jSelection',
  });

  b.bundle(function(err, src) {
    if (err != null) {
      console.error('Browserify error:');
      console.error(err);
    }
  }).pipe(fs.createWriteStream(outputName));
};

module.exports = webpack_config;

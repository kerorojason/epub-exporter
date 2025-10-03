const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const transformManifest = require('./utils/transformManifest');
const { appPath, appSrc, appDist, appTest } = require('./utils/paths');
const { isProduction, isDevelopment } = require('./utils/env');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: isDevelopment,
  },
};

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    popup: path.join(appSrc, 'popup.tsx'),
    contentScript: path.join(appSrc, 'contentScript.ts'),
    background: path.join(appSrc, 'background.ts'),
  },
  output: { filename: '[name].js', path: appDist },
  devtool: isProduction ? false : 'inline-source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: path.join(appSrc, 'manifest.json'), 
          to: path.join(appDist, 'manifest.json'), 
          transform: transformManifest 
        },
        { 
          from: path.join(appSrc, 'rules.json'), 
          to: path.join(appDist, 'rules.json')
        },
      ],
    }),
    new HtmlWebpackPlugin({ filename: 'popup.html', template: path.join(appSrc, 'popup.html'), chunks: ['popup'] }),
    new StylelintWebpackPlugin({ context: appSrc }),
    new ESLintPlugin({
      extensions: ['ts', 'tsx', 'js', 'jsx'],
      exclude: 'node_modules',
      cache: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
              importLoaders: 2,
              modules: { mode: 'global' },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment,
              postcssOptions: {
                plugins: [
                  require('postcss-import')({ root: appPath }),
                  require('postcss-preset-env')(),
                  require('cssnano')(),
                ],
              },
            },
          },
          { 
            loader: 'sass-loader', 
            options: { 
              sourceMap: isDevelopment,
              implementation: require('sass'),
              api: 'modern',
            } 
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          babelLoader,
          'ts-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [babelLoader],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|gif)$/,
        use: { loader: 'file-loader' },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@src': appSrc,
      '@test': appTest,
    },
  },
};

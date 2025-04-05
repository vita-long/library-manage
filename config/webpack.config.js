const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
// 单独提取css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
// 压缩js
const TerserWebpackPlugin = require('terser-webpack-plugin');
// 压缩图片
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');

// 热更新
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// copy public 静态资源
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 环境
const isDevelopment = process.env.NODE_ENV !== 'production';

function getStyle(pre) {
  return [
    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1 // ✅ 确保处理 @import 规则
      }
    },
    {
      // 处理css兼容性，需要package.json中的browserslist配合
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env']
        }
      }
    },
    pre
  ].filter(Boolean);
}

function getModuleStyle(pre) {
  return [
    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[name]__[local]--[hash:base64:5]',
          // 设置为true时css modules会使用named exports的到处方式，也就是命名导出
          // 不能直接使用import styles from './switch.module.css';这种导出方式，会是undefined, 需要使用解构import { custom } from './switch.module.css'
          // 设置false时是默认导出，可以使用import styles from './switch.module.css'
          namedExport: false
        },
        importLoaders: 1 // ✅ 确保处理 @import 规则
      },
    },
    {
      // 处理css兼容性，需要package.json中的browserslist配合
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env']
        }
      }
    },
    pre
  ].filter(Boolean);
}

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: isDevelopment ? undefined : path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: isDevelopment ? 'static/js/[name].js' : 'static/js/[name].[contenthash:8].js',
    chunkFilename: isDevelopment ? 'static/js/[name].chunk.js' : 'static/js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'static/asset/[hash:8][ext][query]',
    clean: true
  },
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        oneOf: [
          {
            test: /\.module\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[name]__[local]--[hash:base64:5]',
                    // 设置为true时css modules会使用named exports的到处方式，也就是命名导出
                    // 不能直接使用import styles from './switch.module.css';这种导出方式，会是undefined, 需要使用解构import { custom } from './switch.module.css'
                    // 设置false时是默认导出，可以使用import styles from './switch.module.css'
                    namedExport: false
                  },
                },
              },
              'postcss-loader',
            ],
          },
          {
            use: getStyle()
          }
        ]
      },
      {
        test: /\.less$/,
        use: getStyle('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        oneOf: [
          {
            test: /\.module\.(scss|sass)$/,
            use: getModuleStyle('sass-loader'),
          },
          {
            use: getStyle('sass-loader')
          }
        ]
      },
      {
        test: /\.styl$/,
        use: getStyle('stylus-loader')
      },
      {
        test: /\.(jpe?g|gif|png|webp|svg)$/,
        type: 'asset',
        parser: {
          // 小于10kb的要缩成base64
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        }
      },
      {
        test: /\.(woff2?|ttf)$/,
        type: 'asset/resource'
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: true,
          plugins: [
            '@babel/plugin-transform-runtime',
            isDevelopment && 'react-refresh/babel'
          ].filter(Boolean)
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new EslintWebpackPlugin({
      configType: 'flat',
      exclude: 'node_modules',
      cache: true
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    !isDevelopment && new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].chunk.[contenthash:8].css',
    }),
    !isDevelopment && new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    isDevelopment && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/]react(.*)?/,
          name: 'chunk-react',
          priority: 40
        },
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-libs',
          priority: 10
        }
      }
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    minimize: !isDevelopment,
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
      new ImageMinimizerWebpackPlugin({
        minimizer: {
          implementation: ImageMinimizerWebpackPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ]
            ]
          }
        }
      })
    ].filter(Boolean)
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.js', '.ts'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  devServer: {
    host: 'localhost',
    port: 8011,
    open: false,
    hot: true,
    historyApiFallback: true
  }
};
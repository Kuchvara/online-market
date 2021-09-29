const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== "production";

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (!devMode) {
        config.minimizer = [
            new OptimizeCssAssetPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config;
};

const cssLoader = (extra) => {
    const loaders = [devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader']
    
    if (extra) {
        loaders.push(extra)
    }
    return loaders
};

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  }]

  if (devMode) {
    loaders.push('eslint-loader')
  }
  return loaders;
}

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    checkout: './src/js/checkout.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  optimization: optimization(),

  devServer: {
    open: true,
    hot: true,
    port: 4200
  },
    
    devtool: devMode ? 'source-map' : 'nosources-source-map',
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: {
              collapseWhitespace: !devMode
          },
            chunks: ['index']            
        }),
        new HTMLWebpackPlugin({
            template: './src/checkout.html',
            filename: 'checkout.html',
            minify: {
              collapseWhitespace: !devMode
          },
            chunks: ['checkout']
        }),
        new CopyWebpackPlugin(
          [
          { from: 'src/images', to: 'images' },
          { from: 'src/js/slider/slick.min.js', to: 'slick.min.js' },
          { from: 'src/js/jquery.mask.js', to: 'jquery.mask.js'}
          ]
        ),        
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
          
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoader()
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoader('sass-loader')
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
                },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                use: [
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
        },        
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },        
        webp: {
          quality: 75
        }
      }
    },
  ],
      },
      
    ]
  }
}
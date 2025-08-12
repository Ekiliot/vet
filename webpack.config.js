const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      main: './public/script.js',
      admin: './public/admin.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        chunks: ['main'],
        inject: 'body'
      }),
      new HtmlWebpackPlugin({
        template: './public/admin.html',
        filename: 'admin.html',
        chunks: ['admin'],
        inject: 'body'
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      compress: true,
      port: 3000,
      hot: true,
      proxy: {
        '/api': 'http://localhost:3001'
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    resolve: {
      extensions: ['.js', '.css']
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
}; 
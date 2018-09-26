const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require("copy-webpack-plugin");

const webpack = require('webpack');

module.exports = {
  entry: {
    app: "./src/app.tsx",
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  resolve: {
    // Add ".ts" and ".tsx" as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ]
  },
  plugins: [
    new webpack.DefinePlugin({}),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: __dirname + "/src/index.html"
    }),
    new CopyWebpackPlugin([])
  ],
  optimization: {
    /** 第三方库 vendor chunk  */
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  }
};
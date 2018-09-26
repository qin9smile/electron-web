const merge = require("webpack-merge");
const common = require("./webpack.config.common");
const path = require("path");
var CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

console.log("Electron.................................");
let ELECTRON = true;
module.exports = merge(common, {
  entry: {
    renderer:"./electron/renderer/",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  target: "electron-renderer",
  /** 将编译后的代码映射回原始源代码 */
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    hot: true
    // clientLogLevel: "none"
  },
  module: {
    rules: [
      /** css */
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
    },
      /** React Typescript 热加载 */
      {
        test: /\.tsx?$/,
        use: [
          "ts-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      ELECTRON: JSON.stringify(ELECTRON)
    })
  ],
  optimization: {
    /** 拆分运行时bundle */
    runtimeChunk: "single"
  }
});
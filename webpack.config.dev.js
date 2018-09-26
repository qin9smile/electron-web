const merge = require("webpack-merge");
const common = require("./webpack.config.common");
const path = require("path");
var CopyWebpackPlugin = require("copy-webpack-plugin");

const webpack = require('webpack');
module.exports = merge(common, {
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  /** 将编译后的代码映射回原始源代码 */
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3002,
    hot: true,
    historyApiFallback: true
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
      /** 图片 */
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
      // BASE_URL: JSON.stringify(BASE_URL),
      // WX_APPID: JSON.stringify(WX_APPID),
      API_URL: JSON.stringify("https://dev.gagogroup.cn"),
      "ELECTRON": JSON.stringify(false),

    })
  ],
  optimization: {
    /** 拆分运行时bundle */
    runtimeChunk: "single"
  }
});
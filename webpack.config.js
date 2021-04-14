const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/style.min.css",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/assets/fonts/",
          to: path.resolve(__dirname, "dist", "assets", "fonts"),
        },
        {
          from: "./src/assets/images",
          to: path.resolve(__dirname, "dist", "assets", "images"),
        },
      ],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.mode = "development";
    config.devtool = "eval-cheap-module-source-map";
    config.devServer = {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 8000,
    };
  }

  if (argv.mode === "production") {
    config.mode = "production";
    config.devtool = "source-map";
  }

  return config;
};

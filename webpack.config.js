const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "docs"),
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
              test: /\.js(\?.*)?$/i,
              exclude: /node_modules/,
              sourceMap: true,
              uglifyOptions: {
                mangle: false,
                keep_fnames: true
              },
            }),
          ],
      },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "src/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin(),
    ],
    // devServer: {
    //     host: '0.0.0.0', //your ip address
    //     port: 8080,
    //     disableHostCheck: true,
    // }
};

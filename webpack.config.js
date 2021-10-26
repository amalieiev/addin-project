const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    devtool: "source-map",
    entry: {
        taskpane: "./src/index.js",
    },
    output: {
        path: path.join(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /.(scss|css)$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 9000,
        open: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./public/index.html",
            chunks: ["taskpane"],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
};

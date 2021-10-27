const path = require("path");
const devCerts = require("office-addin-dev-certs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
require("dotenv").config();

const msw = process.env.MSW ? ["msw"] : [];

module.exports = async (env, options) => ({
    devtool: "source-map",
    entry: {
        msw: "./mocks/browser.js",
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
        open: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        https:
            options.https !== undefined
                ? options.https
                : await devCerts.getHttpsServerOptions().then((config) => {
                      // Unsuported key.
                      delete config.ca;
                      return config;
                  }),
        port: process.env.npm_package_config_dev_server_port || 3000,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./public/index.html",
            chunks: [...msw, "taskpane"],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
});

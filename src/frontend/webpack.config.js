const path = require("path");
const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.argv[process.argv.indexOf("--mode") + 1] === "production";
const PREFIX = isProduction ? "" : "";

module.exports = {
    entry: {
        main: path.resolve(__dirname, "./src/index.tsx"),
    },
    output: {
        path: path.resolve(__dirname, "../../build/resources/main/static"),
        filename: "[name].bundle.js",
        clean: true,
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    devtool: "inline-source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
        }),
        new HtmlWebpackPlugin({
            template: "src/index.html",
            filename: "404.html",
        }),
        new DefinePlugin({
            PREFIX: JSON.stringify(PREFIX),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader?name=images/[name].[ext]",
                    },
                ],
            },
        ],
    },
    devServer: {
        static: "./dist",
        historyApiFallback: true,
    },
    optimization: {
        runtimeChunk: "single",
    },
};

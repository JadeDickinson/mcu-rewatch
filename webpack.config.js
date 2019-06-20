const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PROD_DEVTOOL = "source-map";
const DEV_DEVTOOL = "cheap-module-eval-source-map";

function getWebpackMode(nodeEnv) {
    if (!nodeEnv || (nodeEnv !== "production" && nodeEnv !== "none")) {
        return "development";
    }
    return nodeEnv;
}

function isProduction(nodeEnv) {
    return nodeEnv === "production";
}

module.exports = {
    entry: "./site/index.ts",
    mode: getWebpackMode(process.env.NODE_ENV),
    devtool: isProduction(process.env.NODE_ENV) ? PROD_DEVTOOL : DEV_DEVTOOL,
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: [
                    /node_modules/
                ],
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: [ ".ts", ".js", ".vue", ".json" ]
    },
    output: {
        filename: "assets/js/[name].bundle.js",
        path: path.resolve(__dirname, "public")
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "site/index.html"
        }),
        new CopyWebpackPlugin([
            {
                from: "site/assets/img",
                to: "assets/img",
                ignore: [".gitkeep"]
            }
        ]),
        new VueLoaderPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                node: {
                    name: "node_modules",
                    test: /node_modules/
                }
            }
        }
    }
};

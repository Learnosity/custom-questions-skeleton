/*globals require, __dirname*/
const path = require('path');
const appDir = path.resolve(__dirname, 'src/');
const distDir = path.resolve(__dirname, 'dist/');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    context: appDir,
    entry: {
        question: './question.js',
        scorer: './scorer.js',
    },
    output: {
        path: distDir,
        filename: '[name].js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'clock_question_authoring.html'),
                    to: distDir
                }
            ]
        })
    ],
    resolve: {
        modules: [
            'node_modules'
        ],
        fallback: {
            os: false,
            crypto: false
        }
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-object-rest-spread',
                                '@babel/plugin-syntax-dynamic-import'
                            ]
                        }
                    }
                ]
            }
        ]
    }
};

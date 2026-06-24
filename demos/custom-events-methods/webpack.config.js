/*globals require, __dirname*/
const path = require("path");
const appDir = path.resolve(__dirname, "src/");
const distDir = path.resolve(__dirname, "dist/");

module.exports = {
  context: appDir,
  entry: {
    question: "./question.js",
  },
  output: {
    path: distDir,
    filename: "[name].js",
  },
  plugins: [],
  resolve: {
    modules: ["node_modules"],
    fallback: {
      os: false,
      crypto: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "esbuild-loader",
        options: {
          loader: "js",
          target: "es2015",
        },
      },
    ],
  },
};

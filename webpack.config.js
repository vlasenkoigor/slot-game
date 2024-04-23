// Generated using webpack-cli https://github.com/webpack/webpack-cli
// replace accordingly './.env' with the path of your .env file
require('dotenv/config');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV == 'production';

game = process.env.GAME

console.log('game', game, 'is building...');


const webpack = require('webpack');

const gameBasePath = path.join(__dirname, 'src', 'games', game);

const config = {
    entry: path.join(gameBasePath, 'src', 'index.ts'),

    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: false,
        host: 'localhost',
        hot: false,
        devMiddleware: {
            writeToDisk: false,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        // new BundleAnalyzerPlugin(),
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js',
        }),
        new CopyPlugin({
            patterns: [{ from: path.join(gameBasePath, 'assets'), to: path.resolve(__dirname, 'dist', 'assets'),  noErrorOnMissing: true  }],
        }),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '...'],
    },
};

module.exports = (env, argv) => {

    console.log(env)

    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';

        // config.devtool = argv.watch ? 'eval-cheap-module-source-map' : 'source-map';
        config.devtool = 'source-map';
    }
    return config;
};

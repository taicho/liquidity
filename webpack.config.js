const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');


module.exports = {
    externals: {
        "pixi.js": {
            root:"PIXI",
            commonjs:"pixi.js",
            commonjs2: "pixi.js"
        }
    },   
    mode: 'production',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'liquidity.js',
        path: path.resolve(__dirname, 'dist'),
        library:'Liquidity',
        libraryTarget:'umd',
    },
    plugins: [
        new webpack.DefinePlugin({
            LIQUIDITY_VERSION: JSON.stringify(packageJson.version),
        }),
    ],
};
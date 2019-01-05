var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        main: path.join(__dirname, 'src/index.js')
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.twig$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'melody-loader',
                        options: {
                            plugins: ['idom']
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        watchOptions: {
            ignored: /node_modules/
        },
        overlay: false
    }
};

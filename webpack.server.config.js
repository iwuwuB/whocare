const fs = require('fs');
const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
//	entry: path.resolve(__dirname, '/src/server.js'),
	entry: './src/server.js',

	output: {
		path: __dirname+ '/dst',
		filename: 'server.bundle.js',
		publicPath: '/'
	},

	target: 'node',

	// keep node_module paths out of the bundle
	externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
		'react-dom/server'
	]).reduce(function (ext, mod) {
		ext[mod] = 'commonjs ' + mod
		return ext
	}, {}),

	node: {
		__filename: false,
		__dirname: false
	},

	plugins: [
		new NodemonPlugin()
	],

    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    }
}

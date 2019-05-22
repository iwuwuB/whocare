const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		path: __dirname+ '/dst/public',
		filename: 'bundle.js',
		publicPath: '/'
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.jsx?$/, 
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: ['@babel/plugin-proposal-class-properties']
					}
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.less$/,
				use: [
					{loader: 'style-loader'},
					{loader: 'css-loader'},
					{loader: 'less-loader'}
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/'
					}
				}
			}
		]
	},
	devServer: {
		host: '192.168.2.60',
		port: '8080'
	}
};


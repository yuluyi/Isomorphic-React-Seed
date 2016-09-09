var webpack = require("webpack");
var config = require("./webpack.server.js");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var path = require("path");
var wds = {
	hostname: process.env.HOSTNAME || "localhost",
	port: 8080
};

config.cache = true;
config.debug = true;

config.entry.server.unshift(
	"webpack/hot/poll?1000"
);

config.output.filename = '[name].js';

config.output.publicPath = "http://" + wds.hostname + ":" + wds.port + "/dist";

config.plugins = [
	new webpack.DefinePlugin({__CLIENT__: false, __SERVER__: true, __PRODUCTION__: false, __DEV__: true}),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin(),
	new webpack.BannerPlugin('require("source-map-support").install();',
		{ raw: true, entryOnly: false }),
	new CopyWebpackPlugin([{from: path.join(__dirname, '../src/static'), to: 'static'}])
];

config.module.postLoaders = [
	{test: /\.js$/, loaders: ["babel?cacheDirectory&presets[]=es2015-loose&presets[]=stage-0&presets[]=react&plugins[]=transform-decorators-legacy&plugins[]=transform-proto-to-assign"], exclude: /node_modules/}
];

module.exports = config;

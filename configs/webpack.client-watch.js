var webpack = require("webpack");
var configs = require('./webpack.client.js');
var path = require("path");
var os = require('os');
var IPv4,hostName;

hostName=os.hostname();
for(var i=0;i<os.networkInterfaces().en0.length;i++){
    if(os.networkInterfaces().en0[i].family=='IPv4'){
        IPv4=os.networkInterfaces().en0[i].address;
    }
}

var wds = {
    hostname: process.env.HOSTNAME || IPv4 || "localhost",
    port: 8080
};

configs.forEach(function(config) {
    config.cache = true;
    config.debug = true;
    config.devtool = "#cheap-module-eval-source-map";

    config.entry.unshift(
        "webpack-dev-server/client?http://" + wds.hostname + ":" + wds.port,
        "webpack/hot/dev-server"
    );

    config.output.filename = config.type + ".[name].js";
    config.output.chunkFilename = config.type + ".[name].[id].js";

    config.devServer = {
        publicPath: "http://" + wds.hostname + ":" + wds.port + "/dist/assets",
        hot: true,
        inline: false,
        lazy: false,
        quiet: false,
        noInfo: false,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        stats: {
            colors: true
        },
        host: '0.0.0.0'
    };

    config.output.publicPath = config.devServer.publicPath;
    config.output.hotUpdateMainFilename = "update/[hash]/update.json";
    config.output.hotUpdateChunkFilename = "update/[hash]/[id].update.js";

    config.plugins = [
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __PRODUCTION__: false,
            __DEV__: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
				// split vendor js into its own file
		    new webpack.optimize.CommonsChunkPlugin({
		      name: 'vendor',
		      minChunks: function (module, count) {
		        // any required modules inside node_modules are extracted to vendor
		        return (
		          module.resource &&
		          module.resource.indexOf(
		            path.join(__dirname, '../node_modules')
		          ) === 0
		        )
		      }
		    }),
		    // extract webpack runtime and module manifest to its own file in order to
		    // prevent vendor hash from being updated whenever app bundle is updated
		    new webpack.optimize.CommonsChunkPlugin({
		      name: 'webpack',
		      chunks: ['vendor']
		    })
    ];

    config.module.postLoaders = [{
        test: /\.js$/,
        loaders: ["babel?cacheDirectory&presets[]=es2015-loose&presets[]=stage-0&presets[]=react&presets[]=react-hmre&plugins[]=transform-decorators-legacy&plugins[]=transform-proto-to-assign"],
        exclude: /node_modules/
    }];

});

module.exports = configs;

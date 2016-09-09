var webpack = require("webpack");
var path = require("path");
var resolveId = require("postcss-import/lib/resolve-id");
var svgoSettings = require("./svgo.json");
var ManifestPlugin = require("webpack-manifest-plugin");

var AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];

const config = {
	target:  "web",
	cache:   false,
	context: __dirname,
	debug:   false,
	// devtool: '#source-map',

	module: {
		preLoaders: [
			{test: /\.svg$/, loader: 'svgo-loader?' + JSON.stringify(svgoSettings)}
		],
		loaders: [
			{test: /\.json$/, loaders: ["json"]},
			{test: /\.(ico|gif|png|jpg|jpeg|webp)$/, loaders: ["file?context=static&name=/[name].[hash].[ext]"]},
			{test: /\.svg$/, loader: 'babel?presets[]=es2015&presets[]=react!svg-react'},
			{test: /\.css$/, loader: 'isomorphic-style-loader!css?-autoprefixer&importLoaders=1&localIdentName=[local]_[hash:base64:5]!postcss?pack=default', exclude: /node_modules/},
      {test: /\.(scss|sass)$/, loader: 'isomorphic-style-loader!css?-autoprefixer&importLoaders=2&localIdentName=[local]_[hash:base64:5]!postcss?pack=sass!sass', exclude: /node_modules/},
      {test: /\.html?$/, loader: 'raw', exclude: /node_modules/}
		],
		postLoaders: [
			{test: /\.js$/, loaders: ["babel?presets[]=es2015-loose&presets[]=stage-0&presets[]=react&plugins[]=transform-decorators-legacy&plugins[]=transform-proto-to-assign"], exclude: /node_modules/}
		],
		noParse: /\.min\.js/
	},
	resolve: {
		alias: {
			'#': path.join(process.cwd(), 'src'),
      'moment': 'moment/min/moment.min.js'
		},
		unsafeCache: true,
		modulesDirectories: [
			"src",
			"node_modules",
			"static"
		],
		extensions: ["", ".json", ".js"]
	},
	externals: ['continuation-local-storage'],
	node:    {
		__dirname: true,
		fs:        'empty'
	},
	postcss: function(bundler) {
    return {
      default: [
				require('postcss-import')({
					addDependencyTo: bundler,
					resolve: (id, basedir, importOptions) => {
						if(id.startsWith('#')) return path.join(process.cwd(), './src', id.substr(1));
						else return resolveId(id, basedir, importOptions);
					}
				}),
        require('postcss-nested'),
        require('postcss-cssnext')({browsers: AUTOPREFIXER_BROWSERS})
      ],
      sass: [
        require('autoprefixer')({browsers: AUTOPREFIXER_BROWSERS})
      ]
    }
  }
};

const desktopConfig = Object.assign({}, config, {
  type: 'desktop',
  entry: [
    'babel-polyfill/dist/polyfill.min.js',
    '../src/desktop'
  ],
  output:  {
		path:          path.join(__dirname, "../dist/assets"),
    publicPath:    "//assets.dtcj.com/dt_web/assets",
		filename:      "desktop.[name].[chunkhash].js",
		chunkFilename: "desktop.[name].[chunkname].[chunkhash].[id].js"
	},
  plugins: [
		new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false, __PRODUCTION__: true, __DEV__: false}),
		new webpack.DefinePlugin({"process.env": {NODE_ENV: '"production"'}}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
		new webpack.optimize.AggressiveMergingPlugin(),
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
    }),
    new ManifestPlugin({fileName: '../desktop.manifest.json'})
	]
});

const mobileConfig = Object.assign({}, config, {
  type: 'mobile',
  entry: [
    'babel-polyfill/dist/polyfill.min.js',
    '../src/mobile'
  ],
  output:  {
		path:          path.join(__dirname, "../dist/assets"),
    publicPath:    "//assets.dtcj.com/dt_web/assets",
		filename:      "mobile.[name].[chunkhash].js",
		chunkFilename: "mobile.[name].[chunkhash].[id].js"
	},
  plugins: [
		new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false, __PRODUCTION__: true, __DEV__: false}),
		new webpack.DefinePlugin({"process.env": {NODE_ENV: '"production"'}}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
		new webpack.optimize.AggressiveMergingPlugin(),
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
    }),
    new ManifestPlugin({fileName: '../mobile.manifest.json'})
	]
});

module.exports = [
  desktopConfig,
  mobileConfig
]

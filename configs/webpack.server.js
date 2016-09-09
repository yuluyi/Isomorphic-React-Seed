var webpack       = require("webpack");
var nodeExternals = require("webpack-node-externals");
var path          = require("path");
var fs            = require("fs");
var resolveId 		= require("postcss-import/lib/resolve-id");
var svgoSettings = require("./svgo.json");
var CopyWebpackPlugin = require("copy-webpack-plugin");

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

module.exports = {
	target:  "node",
	cache:   false,
	context: __dirname,
	debug:   false,
	devtool: "source-map",
	entry:   {
		server: [
			"babel-polyfill",
			"../src/server"
		]
	},
	output:  {
		path:          path.join(__dirname, "../dist"),
    publicPath:    "//assets.dtcj.com/dt_web",
		filename:      "[name].js"
	},
	plugins: [
		new webpack.DefinePlugin({__CLIENT__: false, __SERVER__: true, __PRODUCTION__: true, __DEV__: false}),
		new webpack.DefinePlugin({"process.env.NODE_ENV": '"production"'}),
    new webpack.BannerPlugin('require("source-map-support").install();',
  		{ raw: true, entryOnly: false }),
    new CopyWebpackPlugin([{from: path.join(__dirname, '../src/static'), to: 'static'}])
	],
	module:  {
    preLoaders: [
			{test: /\.svg$/, loader: 'svgo-loader?' + JSON.stringify(svgoSettings)}
		],
		loaders: [
			{test: /\.json$/, loaders: ["json"]},
			{test: /\.(ico|gif|png|jpg|jpeg|webp)$/, loaders: ["file?context=static&name=/assets/[name].[hash].[ext]"],  exclude: /node_modules/},
			{test: /\.svg$/, loader: 'babel?presets[]=es2015&presets[]=react!svg-react'},
			{test: /\.css$/, loader: 'isomorphic-style-loader!css?-autoprefixer&importLoaders=1&localIdentName=[local]_[hash:base64:5]!postcss?pack=default', exclude: /node_modules/},
      {test: /\.(scss|sass)$/, loader: 'isomorphic-style-loader!css?-autoprefixer&importLoaders=2&localIdentName=[local]_[hash:base64:5]!postcss?pack=sass!sass', exclude: /node_modules/}
		],
		postLoaders: [
      {test: /\.js$/, loaders: ["babel?presets[]=es2015-loose&presets[]=stage-0&presets[]=react&plugins[]=transform-decorators-legacy&plugins[]=transform-proto-to-assign"], exclude: /node_modules/}
		],
		noParse: /\.min\.js/
	},
	externals: [
    {
      '#/common/Gallery': 'var null',
      'zenscroll': 'var null',
      './desktop.manifest.json': 'commonjs ./desktop.manifest.json',
      './mobile.manifest.json': 'commonjs ./mobile.manifest.json'
    },
    function(context, request, callback) {
      if(/photoswipe/.test(request)) return callback(null, 'var {}');
      callback()
    },
    nodeExternals({
      whitelist: ["webpack/hot/poll?1000"]
    })
  ],
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
	node:    {
    __dirname: false,
		fs:        "empty"
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

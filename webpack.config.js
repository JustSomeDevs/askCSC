const nodeExternals = require('webpack-node-externals');

const common = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2017']
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['eslint-loader', 'babel-loader']
      }
    ]
  },
  externals: [nodeExternals()]
};

const client = {
  entry: "./src/Client/main.js",
  output: { path: __dirname + "/dist", filename: "client.bundle.js" },
  target: 'web'
};

const server = {
  entry: "./src/Server/index.js",
  output: { path: __dirname + "/dist", filename: "server.bundle.js" },
  target: "node"
};

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server)
];

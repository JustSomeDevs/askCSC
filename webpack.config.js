const nodeExternals = require('webpack-node-externals');

const common = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2017'],
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['eslint-loader'],
      },
    ],
  },
  externals: [nodeExternals()],
  stats: {
    warnings: false,
  },
  node: {
    __dirname: false,
  }
};

const client = {
  entry: "./src/client/main.js",
  output: { path: __dirname + "/dist", filename: "client.bundle.js" },
  target: "web",
};

const server = {
  entry: "./src/server/index.js",
  output: { path: __dirname + "/dist", filename: "server.bundle.js" },
  target: "node",
};

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server),
];

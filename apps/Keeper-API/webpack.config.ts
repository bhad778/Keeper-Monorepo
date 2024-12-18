import * as path from 'path';
import * as slsw from 'serverless-webpack';

const nodeExternals = require('webpack-node-externals');

const stage = process.env.STAGE || 'development'; // Default to 'development' if STAGE is not set

export default {
  entry: slsw.lib.entries, // Automatically resolve entry points from serverless.yml
  target: 'node',
  mode: stage === 'production' ? 'production' : 'development', // Use production optimizations for prod
  externals: [nodeExternals(), 'aws-sdk'], // Exclude Node.js modules
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts'], // Resolve .ts and .js files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  cache: {
    type: 'filesystem', // Enables filesystem caching
  },
  devtool: false, // Disables source maps to reduce build size and memory usage,
  optimization: {
    splitChunks: {
      chunks: 'all', // Splits code into smaller chunks
    },
  },
};

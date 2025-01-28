import * as path from 'path';
import * as slsw from 'serverless-webpack';
const nodeExternals = require('webpack-node-externals');

const stage = process.env.VITE_STAGE || 'development';

export default {
  entry: slsw.lib.entries, // Automatically discover functions from serverless.yml
  target: 'node', // Build for Node.js environment
  mode: stage === 'production' ? 'production' : 'development',
  externals: [nodeExternals(), 'aws-sdk'], // Exclude Node modules and AWS SDK from bundle
  output: {
    libraryTarget: 'commonjs2', // CommonJS modules for Node.js
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts'], // Resolve TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Handle TypeScript files
        exclude: /node_modules/, // Ignore node_modules by default
        use: 'ts-loader',
      },
    ],
  },
  cache: {
    type: 'filesystem', // Enable caching for faster builds
  },
  devtool: false, // Disable source maps for production builds
  optimization: {
    splitChunks: {
      chunks: 'all', // Split code into smaller chunks
    },
  },
};

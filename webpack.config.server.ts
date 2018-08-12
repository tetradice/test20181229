import * as webpack from 'webpack'
const nodeExternals = require('webpack-node-externals');
import { TsConfigPathsPlugin } from 'awesome-typescript-loader';

const config: webpack.Configuration = {
  mode: 'development',

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: {
    "server": "./src/server.ts"
  },
  // エンジン
  target: 'node',
  node: {
    // dirnameを正常に取得できるようにするための指定
    __dirname: false
  },

  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: '[name].js'
  },
  // ソースマップ有効
  devtool: 'source-map',

  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$|\.tsx$/,
        // TypeScriptでビルド
        use: ['awesome-typescript-loader']
      },
      {
        // 拡張子 .css の場合
        test: /\.css$/,
        // css-loaderを使用
        use: [
          {
            loader: 'style-loader'
            , options: { sourceMap: true }
          }
          , {
            loader: 'css-loader'
            , options: { modules: true, sourceMap: true }
          }
        ]
      },
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js'
    ],
    plugins: [
      new TsConfigPathsPlugin()
    ]
  },

  // from https://saku.io/build-for-node-runtime-using-webpack/
  externals: [nodeExternals()]
};

export = config;
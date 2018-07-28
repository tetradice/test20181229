var path = require('path');

module.exports = {
  mode: 'development',

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: {
    "main": "./src/main.ts"
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
        use: ['ts-loader']
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
    ]
  }
};

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
        // shebangを取り除いて、TypeScriptでビルド
        use: ['shebang-loader', 'ts-loader']
      },
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        // shebangを取り除いてビルド
        use: ['shebang-loader']
      },
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js'
    ]
  }
};

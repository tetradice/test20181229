import { h, app, View } from "hyperapp"
import { State } from "./typings/state";

import * as comps from "./components";

// ステートを生成
const st: State = undefined;

// 全オブジェクトをノードに変換
let objectNodes: hyperapp.Children[] = [];
for(let key in st.board.objects){
  let boardObj = st.board[key];

  objectNodes.push(<comps.CPBoardObject target={boardObj}></comps.CPBoardObject>);
}

// メインビュー
const view: View<State, any> = (state, actions) => (
  <div>
    {/* 全オブジェクトを出力 */}
    {objectNodes}
  </div>
)

// アプリケーション起動
app(st, null, view, document.getElementById('BOARD'));
import { h, app, View } from "hyperapp"

import * as components from "./components";
import { actions, ActionsType } from "./actions";
import * as utils from "./utils";

// 初期ステートを生成
const st: state.State = utils.createInitialState();

// 全オブジェクトをノードに変換
let objectNodes: hyperapp.Children[] = [];
for(let key in st.board.objects){
  let boardObj = st.board.objects[key];

  objectNodes.push(<components.BoardObject target={boardObj}></components.BoardObject>);
}

// メインビューの定義
const view: View<state.State, ActionsType> = (state, actions) => (
  <div>
    {/* 全オブジェクトを出力 */}
    {objectNodes}
  </div>
)

// アプリケーション起動
let wiredActs = app(st, actions, view, document.getElementById('BOARD')) as ActionsType;
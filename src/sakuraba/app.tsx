import { h, app, View } from "hyperapp";
import * as components from "./components";
import { actions, ActionsType } from "./actions";
import * as utils from "./utils";
import * as devtools from 'hyperapp-redux-devtools';
import debug from 'hyperapp-debug';

// 初期ステートを生成
const st: state.State = utils.createInitialState();


// メインビューの定義
const view: View<state.State, ActionsType> = (state, actions) => {
  // 全オブジェクトをノードに変換
  let objectNodes: hyperapp.Children[] = [];
  for(let key in st.board.objects){
    let boardObj = st.board.objects[key];

    objectNodes.push(<components.BoardObject target={boardObj}></components.BoardObject>);
  }

  return (
    <div>
      {/* 全オブジェクトを出力 */}
      {objectNodes}
    </div>
  )
}

// アプリケーション起動
let wiredActs = devtools(app)(st, actions, view, document.getElementById('BOARD2')) as ActionsType;
console.log('hyperapp OK.');
wiredActs.addCard('hand', 'yurina');
wiredActs.addCard('hand', 'yurina');
wiredActs.addCard('hand', 'yurina');
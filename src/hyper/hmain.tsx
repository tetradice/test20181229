import { h, app, ActionsType, View, Component } from "hyperapp"
import * as sakuraba from '../sakuraba'
import * as state from './state'
import actions from './actions'

// 初期ステートを生成
const st = state.createState();

// カードコンポーネント
const CardComponent: Component<{id: string, key: string}> = (params) => {
  let styles = {left: 0, top: 0};

  return <div class="fbs-card" style={styles}></div>
}

// 桜花結晶コンポーネント
const SakuraTokenComponent = (params: {}, children) => {
  let styles = {left: 0, top: 0};

  <div class="fbs-sakura-token" style={styles}></div>
}

// ビュー
const view: View<state.Root, typeof actions> = (state, actions) => (
  <div>
    {state.board.cards.forEach((card) => (
      <CardComponent id={card.id} key={card.id}></CardComponent>
    ))}
  </div>
)

app(st, actions, view, document.getElementById('APP-CONTAINER'))
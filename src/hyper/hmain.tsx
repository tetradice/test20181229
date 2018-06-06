import { h, app, ActionsType, View, Component } from "hyperapp"
import * as sakuraba from '../sakuraba'
import * as utils from './utils'
import * as helpers from "./helpers";
import State from './state'
import actions from './actions'

// 初期ステートを生成
const st = helpers.createState();

// カードコンポーネント
const CardComponent: Component<{id: string, key: string}> = (params) => {
  let styles = {left: 0, top: 0};

  return <div class="fbs-card" style={styles}></div>
}

// 桜花結晶コンポーネント
const SakuraTokenComponent = (params: {key: string}, children) => {
  let styles = {left: 0, top: 0};

  <div class="fbs-sakura-token" style={styles}></div>
}

// メインビュー
const view: View<State, typeof actions> = (state, actions) => (
  <div>
    {/* 全カードを出力 */}
    {state.board.cards.map((card) => (
      <CardComponent id={card.id} key={card.id}></CardComponent>
    ))}
    {/* 全桜花結晶を出力 */}
    {utils.loop(state.board.distance, (i) => {
      return <SakuraTokenComponent key={`token-distance-${i}`} />
    })}
  </div>
)

let acts = app(st, actions, view, document.getElementById('APP-CONTAINER'));

// 桜花結晶の情報を更新
acts.updateSakuraTokens();
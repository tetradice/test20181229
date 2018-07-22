import { ActionResult, app, h } from "hyperapp";
import { WiredActions, ParamType, 
 } from "./typings/actions";

// Stateの宣言
interface MyState {
  count: number;
  tags: {
      label: string;
  }
}

// Stateの初期化
const state: MyState = {
  count: 0,
  tags: {
      label: '&'
  }
}

// Actionsの実装
const actions = {
  /** カウントを減少 */
  down:     (value: number) => (state: MyState, actions: MyActions) => ({ count: state.count - value }),
  /** カウントを増加 */
  up:       (value: number) => (state: MyState) => ({ count: state.count + value }),
  /** 状態のリセット */
  reset:    () => ({ count: 0 }),
  /** 状態の取得 */
  getState: () => (state: MyState) => (state),
  propFunc: (p: {
    /** paramA */
    a: string;
    b: string;
  }) => (null),
  tags: {
    /** ラベルセット */
    setLabel: (value: string) => (state: MyState['tags']) => (null),
    getLabel: () => (null),
  },
}

// Actionsの型宣言
type MyActions = WiredActions<MyState, typeof actions>;


type params1 = ParamType<MyActions['propFunc']>
type params2 = ParamType<MyActions['tags']['setLabel']>

// View
const view = (state: MyState, actions: MyActions) => {
  let currentState = actions.down(1);
  actions.propFunc({a: '1', b: '2'});
  actions.tags.getLabel();

  return (
    <div>
      <h1>{state.count}</h1>
      <button onclick={() => actions.down(1)}>-</button>
      <button onclick={() => actions.up(1)}>+</button>
      <button onclick={() => actions.reset()}>Reset</button>
    </div>
  )
}

// 起動
let acts = app(state, actions, view, document.body);
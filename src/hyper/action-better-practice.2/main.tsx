import { ActionResult, app, h } from "hyperapp";
import { ActionImplements, Action } from "./typings/actions";

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

// 引数、戻り値の型を指定できるaction型
type Act<Params = void>            = Action<MyState, Params>;
type ActForGetState<Params = void> = Action<MyState, Params, MyState>;

type TagsState                         = MyState['tags'];
type TagsAct<Params = void>            = Action<TagsState, Params>;
type TagsActForGetState<Params = void> = Action<TagsState, Params, TagsState>;

// Actionsの型宣言
interface MyActions {
  /** カウントを減少 */
  down:     Act<number>; 
  /** カウントを増加 */
  up:       Act<number>; 
  /** 状態のリセット */
  reset:    Act;
  /** 状態の取得 */
  getState: ActForGetState;

  tags: {
      setLabel: TagsAct<string>;
      getLabel: TagsActForGetState;
      invalidAct: Act<string>;
  }
}

// Actionsの実装
const actions: ActionImplements<MyActions> = {
  down:     (value) => (state) => ({ count: state.count - value }),
  up:       (value) => (state) => ({ count: state.count + value }),
  reset:    () => ({ count: 0 }),
  getState: () => (state) => (state),
  tags: {
      setLabel: (value) => (state) => (null),
      getLabel: () => (null),
      invalidAct: () => (state) => (null),
  },
}

// View
const view = (state: MyState, actions: MyActions) => {
  let currentState = actions.tags.getLabel();

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
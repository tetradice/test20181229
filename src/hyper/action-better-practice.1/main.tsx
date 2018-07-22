import { ActionResult, app, h } from "hyperapp";
import { ActionImplements, ActionWithParam } from "./typings/actions";

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
type TopAct<Params = void, Return extends ActionResult<MyState> = ActionResult<MyState>> = ActionWithParam<MyState, Params, Return>;
type TagsState = MyState['tags'];
type TagsAct<Params = void, Return extends ActionResult<TagsState> = ActionResult<TagsState>> = ActionWithParam<TagsState, Params, Return>;

// Actionsの型宣言
interface MyActions {
  down:     TopAct<number>; 
  up:       TopAct<number>; 
  reset:    TopAct;
  getState: TopAct<void, MyState>;

  tags: {
      setLabel: TagsAct<string>;
      getLabel: TagsAct<void, {}>;
  }
}

type MyActionsImpl = ActionImplements<MyActions>;

// Actionsの実装
const actions: MyActionsImpl = {
  down:     (value) => (state) => ({ count: state.count - value }),
  up:       (value) => (state) => ({ count: state.count + value }),
  reset:    () => ({ count: 0 }),
  getState: () => (state) => (state),
  tags: {
      setLabel: (value) => (state) => (null),
      getLabel: () => (null)
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
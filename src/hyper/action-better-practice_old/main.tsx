// import { ActionResult, app, h } from "hyperapp";
// import { ActionImplements, ActionBase, Action, ActionWithReturningCurrentState } from "./typings/actions";

// // Stateの宣言
// interface MyState {
//   count: number;
//   tags: {
//       label: string;
//   }
// }

// // Stateの初期化
// const state: MyState = {
//   count: 0,
//   tags: {
//       label: '&'
//   }
// }

// // 引数、戻り値の型を指定できるaction型

// // Actionsの型宣言
// interface MyActions {
//   down:     Action<MyState, number>; 
//   up:       Action<MyState, number>; 
//   reset:    Action<MyState>;
//   getState: ActionWithReturningCurrentState<MyState>;

//   tags: {
//       setLabel: Action<MyState['tags'], string>;
//       getLabel: ActionWithReturningCurrentState<MyState['tags']>;
//   }
// }

// type MyActionsImpl = ActionImplements<MyActions>;

// // Actionsの実装
// const actions: MyActionsImpl = {
//   down:     (value) => (state) => ({ count: state.count - value }),
//   up:       (value) => (state) => ({ count: state.count + value }),
//   reset:    () => ({ count: 0 }),
//   getState: () => (state) => (state),
//   tags: {
//       setLabel: (value) => (state) => (null),
//       getLabel: () => (state) => (state),
//   },
// }

// // View
// const view = (state: MyState, actions: MyActions) => {
//   let currentState = actions.tags.getLabel();

//   return (
//     <div>
//       <h1>{state.count}</h1>
//       <button onclick={() => actions.down(1)}>-</button>
//       <button onclick={() => actions.up(1)}>+</button>
//       <button onclick={() => actions.reset()}>Reset</button>
//     </div>
//   )
// }

// // 起動
// let acts = app(state, actions, view, document.body);
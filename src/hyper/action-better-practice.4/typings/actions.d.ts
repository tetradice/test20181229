import { ActionResult } from "hyperapp";

export as namespace hyperappExt

/** アクション定義 (引数と戻り値の型を指定可能) */
export type Action<
      State
    , Params = void
    , Return extends ActionResult<State> = ActionResult<State>
> = (data?: Params) => Return

/** アクションの実装 (アクション定義から自動生成する) */
export type ActionImplements<State, Actions> = {[key in keyof Actions]: ActionImplementItem<State, Actions, key, Actions[key]>}

type ActionImplementItem<State, Actions, PropName, A> = (
    A extends Action<infer S, infer P, infer R>      ? ((data?: P) => ((state: State, actions: Actions) => R) | R) :
    PropName extends keyof State ? (
        A extends ActionImplements<State[PropName], A> ? (
            ActionImplements<State[PropName], A>
        ) :
        never
    ) :
    never
)

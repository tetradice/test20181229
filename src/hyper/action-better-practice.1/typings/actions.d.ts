import { ActionResult } from "hyperapp";

export as namespace hyperappExt

/** アクション定義 (引数と戻り値の型を指定可能) */
type ActionWithParam<
      State extends object
    , Params = void
    , Return extends ActionResult<State> = ActionResult<State>
> = (data?: Params) => Return

/** アクションの実装 (アクション定義から自動生成可能) */
export type ActionImplements<Actions> = {[key in keyof Actions]: ActionImplementItem<Actions, Actions[key]>}

type ActionImplementItem<Actions, A> = (
    A extends ActionWithParam<infer S, infer P, infer R>       ? ((data?: P) => ((state: S, actions: Actions) => R) | R) :
    A extends ActionImplements<A>                              ? ActionImplements<A> :
    never
)

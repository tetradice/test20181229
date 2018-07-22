// import { ActionResult } from "hyperapp";

// export as namespace hyperappExt

// /** 戻り値を使用しないアクション定義 */
// export type Action<
//       State extends object
//     , Params = void
// > = (data?: Params) => never

// /** 戻り値としてステートを戻すアクション定義 */
// export type ActionWithReturningCurrentState<
//       State extends object
//     , Params = void
// > = (data?: Params) => State


// /** アクションの実装 (アクション定義から自動生成可能) */
// export type ActionImplements<Actions> = {[key in keyof Actions]: ActionImplementItem<Actions, Actions[key]>}

// type ActionImplementItem<Actions, A> = (
//     A extends Action<infer S, infer P, infer R>       ? ((data?: P) => ((state: S, actions: Actions) => R) | R) :
//     A extends Action<infer S, infer P, infer R>       ? ((data?: P) => ((state: S, actions: Actions) => R) | R) :
//     A extends ActionImplements<A>                         ? ActionImplements<A> :
//     never
// )

/** 初期ステートを生成 */
export function createInitialState(): state.State{
    let st = {
          stateDataVersion: 1
        , board: {
              objects: {}
            , actionLog: []
            , chatLog: []
          }
        , zoom: 1
    }
    return st;
}
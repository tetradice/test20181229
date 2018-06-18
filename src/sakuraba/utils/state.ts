/** 初期ステートを生成 */
export function createInitialState(): state.State{
    let st = {
          stateDataVersion: 1
        , board: {
              objects: {}
            , playerNames: {p1: null, p2: null}
            , megamis: {p1: null, p2: null}
            , actionLog: []
            , chatLog: []
          }
        , zoom: 1
    }
    return st;
}

/** 指定した条件を満たすカード一覧を取得 */
export function getCards(state: state.State, region?: CardRegion): state.Card[]{
  let ret: state.Card[] = [];
  for (let key in Object.keys(state.board.objects)) {
    let obj = state.board.objects[key];
    if(obj.type === 'card' && (region === undefined || obj.region === region)){
      ret.push(obj);
    }
  }

  return ret;
}

/** 指定した領域の桜花結晶数を取得 */
export function getSakuraCount(state: state.State, region: SakuraTokenRegion, side?: PlayerSide){
  let ret = 0;
  for (let key in Object.keys(state.board.objects)) {
    let obj = state.board.objects[key];
    if(obj.type === 'sakura-token' && obj.region === region && (side === undefined || obj.side === side)){
      ret++;
    }
  }

  return ret;
} 
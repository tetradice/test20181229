/** 初期ステートを生成 */
export function createInitialState(): state.State{
    let st = {
          stateDataVersion: 1
        , board: {
              objects: []
            , playerNames: {p1: null, p2: null}
            , megamis: {p1: null, p2: null}
            , actionLog: []
            , chatLog: []
          }
        , zoom: 1
        , draggingFromCard: null
    }
    return st;
}

/** 指定した条件を満たすカード一覧を取得 */
export function getCards(state: state.State, region?: CardRegion): state.Card[]{
  let ret: state.Card[] = [];
  state.board.objects.forEach(obj => {
    if(obj.type === 'card' && (region === undefined || obj.region === region)){
      ret.push(obj);
    }
  });

  return ret;
}

/** 指定した領域の桜花結晶数を取得 */
export function getSakuraCount(state: state.State, region: SakuraTokenRegion, side?: PlayerSide){
  let ret = 0;
  state.board.objects.forEach(obj => {
    if(obj.type === 'sakura-token' && obj.region === region && (side === undefined || obj.side === side)){
      ret++;
    }
  });

  return ret;
} 


/** カード1枚を作成 */
export function createCard(id: string, cardId: string, region: CardRegion | null, side?: PlayerSide): state.Card{
  return {
      type: 'card'
    , id: id
    , cardId: cardId
    , region: region
    , indexOfRegion: 0
    , rotated: false
    , opened: false
    , side: side
  };
}
/** 初期ステートを生成 */
export function createInitialState(): state.State{
    let st: state.State = {
          stateDataVersion: 1
        , board: {
              objects: []
            , playerNames: {p1: null, p2: null}
            , watcherNames: {}
            , megamis: {p1: null, p2: null}
            , vigors: {p1: null, p2: null}
            , witherFlags: {p1: false, p2: false}
            
            , megamiOpenFlags: {p1: false, p2: false}
            , firstDrawFlags: {p1: false, p2: false}
            , mariganFlags: {p1: false, p2: false}
            , handOpenFlags: {p1: false, p2: false}
            , handCardOpenFlags: {p1: {}, p2: {}}
          }
        , boardHistoryPast: []
        , boardHistoryFuture: []

        , actionLog: []
        , messageLog: []
        , actionLogVisible: false
        , zoom: 1
    }
    return st;
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
    , openState: 'opened'
    , specialUsed: false
    , linkedCardId: null
    , side: side
  };
}


/** 桜花結晶1つを作成 */
export function createSakuraToken(id: string, region: SakuraTokenRegion | null, side?: PlayerSide): state.SakuraToken{
  return {
      type: 'sakura-token'
    , id: id
    , region: region
    , indexOfRegion: 0
    , side: side
    , linkedCardId: null
  };
}

/** 初期ステートを生成 */
export function createInitialState(): state.State{
  let st: state.State = {
        stateDataVersion: 1
      , board: {
            objects: []
          , playerNames: {p1: null, p2: null}
          , watchers: {}
          , megamis: {p1: null, p2: null}
          , cardSet: 'na-s3'
          , vigors: {p1: null, p2: null}
          , witherFlags: {p1: false, p2: false}
          
          , megamiOpenFlags: {p1: false, p2: false}
          , firstDrawFlags: {p1: false, p2: false}
          , mariganFlags: {p1: false, p2: false}
          , handOpenFlags: {p1: false, p2: false}
          , handCardOpenFlags: {p1: {}, p2: {}}
          , planStatus: {p1: null, p2: null}
          , umbrellaStatus: {p1: null, p2: null}
          , windGuage: {p1: null, p2: null}
          , thunderGuage: {p1: null, p2: null}
        }
      , boardHistoryPast: []
      , boardHistoryFuture: []

      , currentWatcherSessionId: null

      , actionLog: []
      , chatLog: []
      , actionLogVisible: false
      , helpVisible: false
      , settingVisible: false
      , cardListVisible: false
      , bgmPlaying: false
      , zoom: 1
      
      , cardListSelectedMegami: 'yurina'

      , setting: {megamiFaceViewMode: 'background1', language: {allEqual: true, ui: 'ja', uniqueName: 'ja', cardText: 'ja'}}

      , environment: 'development'
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
    , discharged: false
    , ownerSide: side
  };
}


/** 桜花結晶1つを作成 */
export function createSakuraToken(id: string, region: SakuraTokenRegion | null, side?: PlayerSide): state.SakuraToken{
return {
    type: 'sakura-token'
  , id: id
  , region: region
  , indexOfRegion: 0
  , group: null
  , groupTokenDraggingCount: null
  , side: side
  , linkedCardId: null
  , ownerSide: null
};
}

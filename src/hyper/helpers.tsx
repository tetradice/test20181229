import State from './state'
import { PlayerSide } from './types';

export function getBoardSide(state: State, side: PlayerSide) {
    if(side === 1) return state.board.p1Side;
    if(side === 2) return state.board.p2Side;
    return null;
}

/** 新しいステートの生成 */
export function createState(): State{
    let st: State = {
        board: {
              dataVersion: 1

            , distance: 10
            , dust: 0

            , actionLog: []
            , chatLog: []

            , cards: []
            , p1Side: null
            , p2Side: null
        },
        sakuraTokens: [],
        zoom: 1.0
    };

    let getInitialBoardSide = function(){
        return {
            playerName: null
  
          , megamis: null
  
          , aura: 3
          , life: 10
          , flair: 0
  
          , vigor: 0
      }
    }

    st.board.p1Side = getInitialBoardSide();
    st.board.p2Side = getInitialBoardSide();

    return st;
}
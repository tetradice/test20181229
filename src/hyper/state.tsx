export type TimeStr = string;
export type PlayerSide = 1 | 2;
export type SerializableObject = {[key: string]: SerializableValue};
export type SerializableArray = Array<SerializablePrimaryValue> | Array<SerializableObject>;
export type SerializableValue = SerializablePrimaryValue | SerializableArray | SerializableObject;
export type SerializablePrimaryValue = undefined | null | boolean | string | number;


export interface Root extends SerializableObject {
    board: Board;
    zoom: number;
}

export interface Board extends SerializableObject {
    dataVersion: number;

    distance: number;
    dust: number;

    actionLog: LogRecord[];
    chatLog: LogRecord[];

    cards: Card[],
    p1Side: BoardSide;
    p2Side: BoardSide;
}

export interface LogRecord extends SerializableObject {
    body: string;
    time: TimeStr;
}

export interface BoardSide extends SerializableObject {
    playerName: string;

    megamis: string[];

    aura: number;
    life: number;
    flair: number;

    vigor: number;
}

export interface Card extends SerializableObject {
    id: string;
    side: PlayerSide;
    region: string;
    indexOfRegion: number;
}

// 新しいステートを生成する関数
export function createState(): Root{
    let st: Root = {
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
  
          , library: []
          , hands: []
          , used: []
          , hiddenUsed: []
      }
    }

    st.board.p1Side = getInitialBoardSide();
    st.board.p2Side = getInitialBoardSide();

    return st;
}
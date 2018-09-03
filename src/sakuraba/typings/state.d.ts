import { Megami } from "sakuraba";
import { ClientSocket } from "../socket";

export as namespace state

/** ステート */
export interface State {
    stateDataVersion: number;

    board: Board;
    boardHistoryPast: BoardHistoryItem[];
    boardHistoryFuture: BoardHistoryItem[];

    zoom: number;
    socket?: ClientSocket;
    boardId?: string;
    side?: PlayerSide;

    actionLog: LogRecord[];
    messageLog: LogRecord[];

    actionLogVisible: boolean;
}

/** ボード履歴 */
export interface BoardHistoryItem {
    board: Board;
    appendedLogs: state.LogRecord[];
}

/** 卓情報 */
export interface Board {
    objects: BoardObject[];
    playerNames: {p1: string, p2: string};
    megamis: {p1: Megami[], p2: Megami[]};

    /** 集中力 */
    vigors: {p1: VigorValue, p2: VigorValue};

    /** 萎縮 */
    witherFlags: {p1: boolean, p2: boolean};

    /** メガミを公開したかどうか */
    megamiOpenFlags: {p1: boolean, p2: boolean};
    /** 最初の手札を引いたかどうか */
    firstDrawFlags: {p1: boolean, p2: boolean};
    /** 手札の引き直しを行ったかどうか */
    mariganFlags: {p1: boolean, p2: boolean};
    
}

/**
 * 卓上に配置するオブジェクト (カード、桜花結晶など)
 **/
export type BoardObject = Card | SakuraToken;

export interface BoardObjectBase {
    id: string;
    type: 'card' | 'sakura-token';
    side: PlayerSide;
    indexOfRegion: number;
}

export interface Card extends BoardObjectBase {
    type: 'card'

    cardId: string;
    region: CardRegion;
    rotated: boolean;
    openState: CardOpenState;
    specialUsed: boolean;
}

export interface SakuraToken extends BoardObjectBase {
    type: 'sakura-token'

    region: SakuraTokenRegion;
    indexOfRegion: number;
    onCardId: string;
}

/** ログ1行分のデータ */
export interface LogRecord {
    body: string;
    time: string; // momentから変換した値を渡す
    playerSide?: SheetSide;
    visibility: LogVisibility;
}


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
    tableId?: string;
    
    /** 自分の席位置 (p1/p2/観戦者) */
    side?: SheetSide;
    /** 自分がいまp1/p2どちら側の席から卓を見ているか */
    viewingSide?: PlayerSide;

    actionLog: LogRecord[];
    chatLog: LogRecord[];

    actionLogVisible: boolean;
    bgmPlaying: boolean;
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
    watcherNames: {[socketId: string]: string}; // ソケットIDに対して観戦者名を割り当てる
    megamis: {p1: Megami[], p2: Megami[]};

    /** 集中力 */
    vigors: {p1: VigorValue, p2: VigorValue};

    /** 萎縮 */
    witherFlags: {p1: boolean, p2: boolean};

    /** メガミを公開したかどうか */
    megamiOpenFlags: {p1: boolean, p2: boolean};
    /** 最初の手札を引いたかどうか */
    firstDrawFlags: {p1: boolean, p2: boolean};
    /** 手札の引き直しを行った（もしくは行わないことを選択した）かどうか */
    mariganFlags: {p1: boolean, p2: boolean};

    /** 手札を相手に公開しているかどうか */
    handOpenFlags: {p1: boolean, p2: boolean};
    /** 特定の手札を相手に公開しているかどうか */
    handCardOpenFlags: {p1: {[id: string]: boolean | undefined}, p2: {[id: string]: boolean | undefined}};
    /** 計略の状態 */
    planStatus: {p1: PlanState, p2: PlanState};
    /** 傘の状態 */
    umbrellaStatus: {p1: UmbrellaState, p2: UmbrellaState};
    /** 風ゲージ */
    windGuage: {p1: number | null, p2: number | null};
    /** 雷ゲージ */
    thunderGuage: {p1: number | null, p2: number | null};
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
    linkedCardId: string;

    /** 帯電が解除されたか */
    discharged: boolean;

    /** 所有者 */
    ownerSide: PlayerSide;
}

export interface SakuraToken extends BoardObjectBase {
    type: 'sakura-token'

    region: SakuraTokenRegion;
    indexOfRegion: number;
    linkedCardId: string;
}

/** ログ1行分のデータ */
export interface LogRecord {
    body: string;
    time: string; // momentから変換した値を渡す
    playerSide?: SheetSide;
    visibility: LogVisibility;
}
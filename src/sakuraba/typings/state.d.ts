import { Megami } from "sakuraba";
import { ClientSocket } from "../socket";

export as namespace state;

/** ステート (バージョン不明) */
export type VersionUnspecifiedState = state_1.State | State;

/** ボード (バージョン不明) */
export type VersionUnspecifiedBoard = state_1.Board | Board;


/** 設定オブジェクト (バージョン不明) */
export type VersionUnspecifiedSetting = state_1.Setting | Setting;

/** ステート */
export interface State {
    stateDataVersion: 2;

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
    /** 自分が観戦者の場合に、プレイヤーの手札などを見ることができるか */
    handViewableFromCurrentWatcher?: boolean;

    currentWatcherSessionId: string;

    actionLog: ActionLogRecord[];
    chatLog: ChatLogRecord[];

    actionLogVisible: boolean;
    helpVisible: boolean;
    settingVisible: boolean;
    cardListVisible: boolean;
    bgmPlaying: boolean;

    cardListSelectedMegami: Megami;

    setting: Setting;

    environment: 'production' | 'development';
}

/** ボード履歴 */
export interface BoardHistoryItem {
    board: Board;
    appendedLogs: ActionLogRecord[];
}

/** 設定 */
export interface Setting {
    settingDataVersion: State['stateDataVersion'];

    /** メガミのフェイス画像表示 */
    megamiFaceViewMode: 'background1' | 'none';

    /** 言語設定 */
    language: LanguageSetting;

    /** 英語のカード画像表示フラグ (テスト用) */
    cardImageEnabledTestEn?: boolean;
}

/** 卓情報 */
export interface Board {
    objects: BoardObject[];
    playerNames: {p1: string, p2: string};
    watchers: {[sessionId: string]: WatcherInfo};
    megamis: {p1: Megami[], p2: Megami[]};

    // 選択しているカードセット
    cardSet: CardSet;

    /** 集中力 */
    vigors: {p1: VigorValue, p2: VigorValue};

    /** 畏縮 */
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

export type SakuraTokenGroup = 'normal' | 'inactive' | 'artificial-p1' | 'artificial-p2';

export interface SakuraToken extends BoardObjectBase {
    type: 'sakura-token'

    region: SakuraTokenRegion;
    indexOfRegion: number;

    linkedCardId: string;

    /** 造花結晶である */
    artificial?: boolean;

    /** 所有プレイヤー (造花結晶のみ) */
    ownerSide: PlayerSide;

    // 以下は一時領域情報 (updateRegionInfoで更新される)

    /** グループ (通常/無効/p1造花結晶/p2造花結晶) */
    group: SakuraTokenGroup;

    /** ドラッグ時に同じグループの桜花結晶をいくつ操作するか */
    groupTokenDraggingCount: number;


    /** 間合-1トークンである (桜花結晶に重ねる) */
    distanceMinus?: boolean
}

/** ログ1行分のデータ */
export interface LogRecord {
    type: 'c' | 'a';
    time: string; // momentから変換した値を渡す
    side?: SheetSide;
    watcherSessionId?: string;
    visibility: LogVisibility;
    indent?: boolean;
}

export interface ChatLogRecord extends LogRecord {
    type: 'c';
    body: string;
}

export interface ActionLogRecord extends LogRecord {
    type: 'a';
    body: ActionLogBody;
}


export type ActionLogBody = ActionLogItem | ActionLogItem[]

export type ActionLogItem = string | number | ActionLogLocaleStringItem | ActionLogCardNameItem | ActionLogCardSetNameItem | ActionLogMegamiNameItem;

export interface ActionLogLocaleStringItem {
    type: 'ls';
    key: string;
    params?: {[key: string]: ActionLogBody}
}

export interface ActionLogCardNameItem {
    type: 'cn';
    cardSet: CardSet;
    cardId: string;
}

export interface ActionLogCardSetNameItem {
    type: 'cs';
    cardSet: CardSet;
}

export interface ActionLogMegamiNameItem {
    type: 'mn';
    megami: Megami;
}

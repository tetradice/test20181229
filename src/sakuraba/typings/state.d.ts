import { Megami } from "../../sakuraba";

export as namespace state

/** ステート */
export interface State {
    stateDataVersion: number;

    board: Board;
    zoom: number;
    socket?: SocketIOClient.Socket;
    boardId?: string;
    side?: PlayerSide;

    draggingFromCard: Card;
    draggingHoverCardRegion: CardRegion;
}

/** 卓情報 */
export interface Board {
    objects: BoardObject[];
    playerNames: {p1: string, p2: string};
    megamis: {p1: Megami[], p2: Megami[]};

    actionLog: LogRecord[];
    chatLog: LogRecord[];
}

/**
 * 卓上に配置するオブジェクト (カード、桜花結晶など)
 **/
export type BoardObject = Card | SakuraToken | Vigor;

export interface BoardObjectBase {
    id: string;
    type: 'card' | 'sakura-token' | 'vigor';
    side: PlayerSide;
}

export interface Card extends BoardObjectBase {
    type: 'card'

    cardId: string;
    region: CardRegion;
    indexOfRegion: number;
    rotated: boolean;
    opened: boolean;
    known: {p1: boolean, p2: boolean};
}

export interface SakuraToken extends BoardObjectBase {
    type: 'sakura-token'

    region: SakuraTokenRegion;
    indexOfRegion: number;
    onCardId: string;
}

export interface Vigor extends BoardObjectBase {
    type: 'vigor'
    value: number;
}

/** ログ1行分のデータ */
export interface LogRecord {
    body: string;
    time: string; // momentから変換した値を渡す
    playerSide?: PlayerSide;
}


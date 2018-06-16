export as namespace sakuraba

/** JSONにSerialize可能な値を表す型 */
export type SerializableObject = {[key: string]: SerializableValue};
export type SerializableValue = SerializablePrimitiveValue | SerializableArray | SerializableObject;
export type SerializableArray = Array<SerializablePrimitiveValue> | Array<SerializableObject>;
export type SerializablePrimitiveValue = undefined | null | boolean | string | number;

/** ステート */
export interface State extends SerializableObject {
    stateDataVersion: number;

    board: Board;
    zoom: number;
}

/** 卓情報 */
export interface Board extends SerializableObject {
    objects: {[id: string]: BoardObject};

    actionLog: LogRecord[];
    chatLog: LogRecord[];
}

/**
 * 卓上に配置するオブジェクト (カード、桜花結晶など)
 **/
export type BoardObject = Card | SakuraToken | Vigor;

export interface BoardObjectBase extends SerializableObject {
    id: string;
    type: 'card' | 'sakura-token' | 'vigor';
    side: 1 | 2 | null;
}

export interface Card extends BoardObjectBase {
    type: 'card'

    region: string;
    indexOfRegion: number;
}

export interface SakuraToken extends BoardObjectBase {
    type: 'sakura-token'

    region: string;
    indexOfRegion: number;
    onCardId: string;
}

export interface Vigor extends BoardObjectBase {
    type: 'vigor'
}

/** ログ1行分のデータ */
export interface LogRecord extends SerializableObject {
    body: string;
    time: string; // momentから変換した値を渡す
}


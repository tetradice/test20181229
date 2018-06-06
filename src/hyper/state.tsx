import { SerializableObject, TimeStr, PlayerSide, RegionName } from "./types";

/** ステートルート */
export default interface Root extends SerializableObject {
    board: Board;
    sakuraTokens: SakuraToken[];
    zoom: number;
}

/** 卓情報 */
interface Board extends SerializableObject {
    dataVersion: number;

    distance: number;
    dust: number;

    actionLog: LogRecord[];
    chatLog: LogRecord[];

    cards: Card[],
    p1Side: BoardSide;
    p2Side: BoardSide;
}

/** ログ1行分のデータ */
interface LogRecord extends SerializableObject {
    body: string;
    time: TimeStr;
}

interface BoardSide extends SerializableObject {
    playerName: string;

    megamis: string[];

    aura: number;
    life: number;
    flair: number;

    vigor: number;
}

interface Card extends SerializableObject {
    id: string;
    side: PlayerSide;
    region: RegionName;
    indexOfRegion: number;

    used?: boolean;
}

interface SakuraToken extends SerializableObject {
    region: RegionName;
    indexOfRegion: number;
}


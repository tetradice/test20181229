// 独自型
export type SakuraTokenArea = "aura" | "life" | "flair" | "distance" | "dust" | "on-card";
export type CardArea = "library" | "hand" | "used" | "hidden-used" | "special";
export type RegionName = SakuraTokenArea | CardArea | "vigor";
export type CardType = "attack" | "reaction" | "action" | "fullpower" | "enhance";
export type CardBaseType = 'normal' | 'special';
export type Side = 'p1' | 'p2' | 'watch';

// メガミ情報
interface MegamiDataItem {
    name: string;
    symbol: string;
}
export const MEGAMI_DATA = {
      'yurina': {name: 'ユリナ', symbol: '刀'}
    , 'saine': {name: 'サイネ', symbol: '薙刀'}
    , 'himika': {name: 'ヒミカ', symbol: '銃'}
    , 'tokoyo': {name: 'トコヨ', symbol: '扇'}
    , 'oboro': {name: 'オボロ', symbol: '忍'}
    , 'yukihi': {name: 'ユキヒ', symbol: '傘/簪'}
    , 'shinra': {name: 'シンラ', symbol: '書'}
    , 'hagane': {name: 'ハガネ', symbol: '槌'}
    , 'chikage': {name: 'チカゲ', symbol: '毒'}
    , 'kururu': {name: 'クルル', symbol: '絡繰'}
    , 'thallya': {name: 'サリヤ', symbol: '乗騎'}
    , 'raira': {name: 'ライラ', symbol: '爪'}
};
export type Megami = keyof (typeof MEGAMI_DATA);

// カード情報
interface CardDataItem {
    megami: Megami;
    name: string;
    ruby?: string;
    baseType: CardBaseType;
    types: CardType[];
    range?: string;
    damage?: string;
    capacity?: string;
    cost?: string;
    text: string;
}
export const CARD_DATA: {[key: string]: CardDataItem} = {
      '01-yurina-o-n-1': {megami: 'yurina', name: '斬', ruby: 'ざん', baseType: 'normal', types: ['attack'], range: "3-4", damage: '3/1', text: ''}
    , '01-yurina-o-n-2': {megami: 'yurina', name: '一閃', ruby: 'いっせん', baseType: 'normal', types: ['attack'], range: "3", damage: '2/2', text: '【常時】決死-あなたのライフが3以下ならば、この《攻撃》は+1/+0となる。'}
    , '01-yurina-o-n-3': {megami: 'yurina', name: '柄打ち', ruby: 'つかうち', baseType: 'normal', types: ['attack'], range: "1-2", damage: '2/1', text: '【攻撃後】決死-あなたのライフが3以下ならば、このターンにあなたが次に行う《攻撃》は+1/+0となる。'}
    , '01-yurina-o-n-4': {megami: 'yurina', name: '居合', ruby: 'いあい', baseType: 'normal', types: ['attack', 'fullpower'], range: "3-4", damage: '4/3', text: ''}
    , '01-yurina-o-n-5': {megami: 'yurina', name: '足捌き', ruby: 'あしさばき', baseType: 'normal', types: ['action'], text: '現在の間合が4以上ならば、間合→ダスト：2'}
    , '01-yurina-o-n-6': {megami: 'yurina', name: '圧気', ruby: 'あっき', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙\n【破棄時】攻撃『適正距離1-4、3/-』を行う。'}
    , '01-yurina-o-n-7': {megami: 'yurina', name: '気炎万丈', ruby: 'きえんばんじょう', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '2', text: '【展開中】決死-あなたのライフが3以下ならば、あなたの他のメガミによる《攻撃》は+1/+1となるとともに超克を得る。'}
    , '01-yurina-o-s-1': {megami: 'yurina', name: '月影落', ruby: 'つきかげおとし', baseType: 'special', cost: '7', types: ['attack'], range: '3-4', damage: '4/4', text: ''}
    , '01-yurina-o-s-2': {megami: 'yurina', name: '浦波嵐', ruby: 'うらなみあらし', baseType: 'special', cost: '3', types: ['attack', 'reaction'], range: '0-10', damage: '2/-', text: '【攻撃後】対応した《攻撃》は-2/+0となる。'}
    , '01-yurina-o-s-3': {megami: 'yurina', name: '浮舟宿', ruby: 'うきふねやどし', baseType: 'special', cost: '3', types: ['action'], text: 'ダスト→自オーラ：5 \n【再起】決死-あなたのライフが3以下である。'}
    , '01-yurina-o-s-4': {megami: 'yurina', name: '天音揺波の底力', ruby: 'あまねゆりなのそこぢから', baseType: 'special', cost: '5', types: ['attack', 'fullpower'], range: '1-4', damage: '5/5', text: '【常時】決死-あなたのライフが3以下でないと、このカードは使用できない。'}


    , '02-saine-o-n-1': {megami: 'saine', name: '八方振り', ruby: 'はっぽうぶり', baseType: 'normal', types: ['attack'], range: "4-5", damage: '2/1', text: '【攻撃後】八相-あなたのオーラが0ならば、攻撃『適正距離4-5、2/1』を行う。'}
    , '02-saine-o-n-2': {megami: 'saine', name: '薙斬り', ruby: 'なぎぎり', baseType: 'normal', types: ['attack', 'reaction'], range: "4-5", damage: '3/1', text: ''}
    , '02-saine-o-n-3': {megami: 'saine', name: '返し刃', ruby: 'かえしやいば', baseType: 'normal', types: ['attack'], range: "3-5", damage: '1/1', text: '【攻撃後】このカードを対応で使用したならば、攻撃『適正距離3-5、2/1、対応不可』を行う。'}
    , '02-saine-o-n-4': {megami: 'saine', name: '見切り', ruby: 'みきり', baseType: 'normal', types: ['action'], text: '【常時】八相-あなたのオーラが0ならば、このカードを《対応》を持つかのように相手の《攻撃》に割り込んで使用できる。\n間合⇔ダスト：1'}
    , '02-saine-o-n-5': {megami: 'saine', name: '圏域', ruby: 'けんいき', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開時】ダスト→間合：1\n【展開中】達人の間合は2大きくなる。'}
    , '02-saine-o-n-6': {megami: 'saine', name: '衝音晶', ruby: 'しょうおんしょう', baseType: 'normal', types: ['enhance', 'reaction'], capacity: '1', text: '【展開時】対応した《攻撃》は-1/+0となる。 \n【破棄時】攻撃『適正距離0-10、1/-、対応不可』を行う。'}
    , '02-saine-o-n-7': {megami: 'saine', name: '無音壁', ruby: 'むおんへき', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '5', text: '【展開中】あなたへのダメージを解決するに際し、このカードの上に置かれた桜花結晶をあなたのオーラにあるかのように扱う。'}
    , '02-saine-o-s-1': {megami: 'saine', name: '律動弧戟', ruby: 'りつどうこげき', baseType: 'special', cost: '5', types: ['action'], range: '3-4', damage: '4/4', text: '攻撃『適正距離3-4、1/1』を行う。\n攻撃『適正距離4-5、1/1』を行う。\n攻撃『適正距離3-5、2/2』を行う。'}
    , '02-saine-o-s-2': {megami: 'saine', name: '響鳴共振', ruby: 'きょうめいきょうしん', baseType: 'special', cost: '1', types: ['action'], text: '相手のオーラが5以上ならば、相オーラ→間合：3'}
    , '02-saine-o-s-3': {megami: 'saine', name: '音無砕氷', ruby: 'おとなしさいひょう', baseType: 'special', cost: '1', types: ['action', 'reaction'], text: '対応した《攻撃》は-1/-1となる。\n【再起】八相-あなたのオーラが0である。'}
    , '02-saine-o-s-4': {megami: 'saine', name: '氷雨細音の果ての果て', ruby: 'ひさめさいねのはてのはて', baseType: 'special', cost: '4', types: ['attack', 'reaction'], range: '1-5', damage: '5/5', text: '【常時】このカードは切札に対する対応でしか使用できない。'}
};

// クラス
export class Board {
    data: BoardData;

    constructor(data?: BoardData){
        if(data !== undefined){
            this.data = data;
        } else {
            this.data = new BoardData();
        }
    }

    getMySide(side: Side){
        if(side === 'p1'){
            return this.data.p1Side;
        } else if(side === 'p2'){
            return this.data.p2Side;
        }
        return null;
    }

    getOpponentSide(side: Side){
        if(side === 'p1'){
            return this.data.p2Side;
        } else if(side === 'p2'){
            return this.data.p1Side;
        }
        return null;
    }
}

export class BoardData {
    dataVersion = 1;

    distance: number = 10;
    dust: number = 0;
    tokensOnCard: {[cardId: string]: number} = {};

    actionLog: LogRecord[] = [];
    chatLog: LogRecord[] = [];

    p1Side: BoardSide;
    p2Side: BoardSide;

    constructor(){
        this.p1Side = new BoardSide();
        this.p2Side = new BoardSide();
    }
}

export class BoardSide {
    playerName: string = null;

    megamis: Megami[] = null;

    aura: number = 3;
    life: number = 10;
    flair: number = 0;

    vigor: number = 0;

    library: Card[] = [];
    hands: Card[] = [];
    used: Card[] = [];
    hiddenUsed: Card[] = [];
    specials: Card[] = [];
}

export class LogRecord {
    text: string;
    created: Date;
}

export class Card {
    id: string;
    used?: boolean; // 切札にある場合のみ
    sakuraToken?: number; // 捨て札にある場合のみ
    type: string;

    constructor(id: string){
        this.id = id;
    }

    get data(): CardDataItem{
        return CARD_DATA[this.id];
    }
}

export class SpecialCard extends Card {
    used: boolean = false;
}



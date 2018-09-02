import {Serializable, Serialize, SerializeProperty} from "ts-serializer";
import * as moment from 'moment';

// 独自型
export type SakuraTokenArea = "aura" | "life" | "flair" | "distance" | "dust" | "on-card";
export type CardArea = "library" | "hand" | "used" | "hidden-used" | "special";
export type RegionName = SakuraTokenArea | CardArea | "vigor";
export type CardType = "attack" | "reaction" | "action" | "fullpower" | "enhance";
export type CardBaseType = 'normal' | 'special' | 'extra';

// メガミ情報
interface MegamiDataItem {
    name: string;
    symbol: string;
    base?: Megami;
}
export const MEGAMI_DATA = {
      'yurina':   {name: 'ユリナ', symbol: '刀'}
    //, 'yurina-a': {name: '第一章ユリナ', symbol: '古刀', base: 'yurina'}
    , 'saine':    {name: 'サイネ', symbol: '薙刀'}
    //, 'saine-a':  {name: '第二章サイネ', symbol: '琵琶', base: 'saine'}
    , 'himika':   {name: 'ヒミカ', symbol: '銃'}
    //, 'himika-a': {name: '原初ヒミカ', symbol: '炎', base: 'himika'}
    , 'tokoyo':   {name: 'トコヨ', symbol: '扇'}
    //, 'tokoyo-a': {name: '旅芸人トコヨ', symbol: '笛', base: 'tokoyo'}
    , 'oboro':    {name: 'オボロ', symbol: '忍'}
    , 'yukihi':   {name: 'ユキヒ', symbol: '傘/簪'}
    , 'shinra':   {name: 'シンラ', symbol: '書'}
    , 'hagane':   {name: 'ハガネ', symbol: '槌'}
    , 'chikage':  {name: 'チカゲ', symbol: '毒'}
    , 'kururu':   {name: 'クルル', symbol: '絡繰'}
    , 'thallya':  {name: 'サリヤ', symbol: '乗騎'}
    , 'raira':    {name: 'ライラ', symbol: '爪'}
    , 'utsuro':   {name: 'ウツロ', symbol: '鎌'}
};
export type Megami = keyof (typeof MEGAMI_DATA);

// カード情報
interface CardDataItemBase {
    megami: Megami;
    name: string;
    ruby?: string;
    types: CardType[];
    range?: string;
    rangeOpened?: string;
    damage?: string;
    damageOpened?: string;
    capacity?: string;
    text: string;
    textOpened?: string;
}

interface NormalCardDataItem extends CardDataItemBase {
    baseType: 'normal';
}

interface SpecialCardDataItem extends CardDataItemBase {
    baseType: 'special';
    cost?: string;
}

interface ExtraCardDataItem extends CardDataItemBase {
    baseType: 'extra';
}


type CardDataItem = NormalCardDataItem | SpecialCardDataItem | ExtraCardDataItem;

export const CARD_DATA: {[key: string]: CardDataItem} = {
      '01-yurina-o-n-1': {megami: 'yurina', name: '斬', ruby: 'ざん', baseType: 'normal', types: ['attack'], range: "3-4", damage: '3/1', text: ''}
    , '01-yurina-o-n-2': {megami: 'yurina', name: '一閃', ruby: 'いっせん', baseType: 'normal', types: ['attack'], range: "3", damage: '2/2', text: '【常時】決死-あなたのライフが3以下ならば、この《攻撃》は+1/+0となる。'}
    , '01-yurina-o-n-3': {megami: 'yurina', name: '柄打ち', ruby: 'つかうち', baseType: 'normal', types: ['attack'], range: "1-2", damage: '2/1', text: '【攻撃後】決死-あなたのライフが3以下ならば、このターンにあなたが次に行う《攻撃》は+1/+0となる。'}
    , '01-yurina-o-n-4': {megami: 'yurina', name: '居合', ruby: 'いあい', baseType: 'normal', types: ['attack', 'fullpower'], range: "2-4", damage: '4/3', text: '【常時】現在の間合が2以下ならば、この攻撃は-1/-1となる。'}
    , '01-yurina-o-n-5': {megami: 'yurina', name: '足捌き', ruby: 'あしさばき', baseType: 'normal', types: ['action'], text: '現在の間合が4以上ならば、間合→ダスト：2\n現在の間合が1以下ならば、ダスト→間合：2'}
    , '01-yurina-o-n-6': {megami: 'yurina', name: '圧気', ruby: 'あっき', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙\n【破棄時】攻撃『適正距離1-4、3/-』を行う。'}
    , '01-yurina-o-n-7': {megami: 'yurina', name: '気炎万丈', ruby: 'きえんばんじょう', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '2', text: '【展開中】決死-あなたのライフが3以下ならば、あなたの他のメガミによる《攻撃》は+1/+1となるとともに超克を得る。'}
    , '01-yurina-o-s-1': {megami: 'yurina', name: '月影落', ruby: 'つきかげおとし', baseType: 'special', cost: '7', types: ['attack'], range: '3-4', damage: '4/4', text: ''}
    , '01-yurina-o-s-2': {megami: 'yurina', name: '浦波嵐', ruby: 'うらなみあらし', baseType: 'special', cost: '3', types: ['attack', 'reaction'], range: '0-10', damage: '2/-', text: '【攻撃後】対応した《攻撃》は-2/+0となる。'}
    , '01-yurina-o-s-3': {megami: 'yurina', name: '浮舟宿', ruby: 'うきふねやどし', baseType: 'special', cost: '2', types: ['action'], text: 'ダスト→自オーラ：5 \n【即再起】決死-あなたのライフが3以下である。'}
    , '01-yurina-o-s-4': {megami: 'yurina', name: '天音揺波の底力', ruby: 'あまねゆりなのそこぢから', baseType: 'special', cost: '5', types: ['attack', 'fullpower'], range: '1-4', damage: '5/5', text: '【常時】決死-あなたのライフが3以下でないと、このカードは使用できない。'}

    , '02-saine-o-n-1': {megami: 'saine', name: '八方振り', ruby: 'はっぽうぶり', baseType: 'normal', types: ['attack'], range: "4-5", damage: '2/1', text: '【攻撃後】八相-あなたのオーラが0ならば、攻撃『適正距離4-5、2/1』を行う。'}
    , '02-saine-o-n-2': {megami: 'saine', name: '薙斬り', ruby: 'なぎぎり', baseType: 'normal', types: ['attack', 'reaction'], range: "4-5", damage: '3/1', text: ''}
    , '02-saine-o-n-3': {megami: 'saine', name: '返し刃', ruby: 'かえしやいば', baseType: 'normal', types: ['attack'], range: "3-5", damage: '1/1', text: '【攻撃後】このカードを対応で使用したならば、攻撃『適正距離3-5、2/1、対応不可』を行う。'}
    , '02-saine-o-n-4': {megami: 'saine', name: '見切り', ruby: 'みきり', baseType: 'normal', types: ['action'], text: '【常時】八相-あなたのオーラが0ならば、このカードを《対応》を持つかのように相手の《攻撃》に割り込んで使用できる。\n間合⇔ダスト：1'}
    , '02-saine-o-n-5': {megami: 'saine', name: '圏域', ruby: 'けんいき', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開時】ダスト→間合：1\n【展開中】達人の間合は2大きくなる。'}
    , '02-saine-o-n-6': {megami: 'saine', name: '衝音晶', ruby: 'しょうおんしょう', baseType: 'normal', types: ['enhance', 'reaction'], capacity: '1', text: '【展開時】対応した《攻撃》は-1/+0となる。 \n【破棄時】攻撃『適正距離0-10、1/-、対応不可』を行う。'}
    , '02-saine-o-n-7': {megami: 'saine', name: '無音壁', ruby: 'むおんへき', baseType: 'normal', types: ['enhance', 'fullpower'], capacity: '5', text: '【展開中】あなたへのダメージを解決するに際し、このカードの上に置かれた桜花結晶をあなたのオーラにあるかのように扱う。'}
    , '02-saine-o-s-1': {megami: 'saine', name: '律動弧戟', ruby: 'りつどうこげき', baseType: 'special', cost: '6', types: ['action'], text: '攻撃『適正距離3-4、1/1』を行う。\n攻撃『適正距離4-5、1/1』を行う。\n攻撃『適正距離3-5、2/2』を行う。'}
    , '02-saine-o-s-2': {megami: 'saine', name: '響鳴共振', ruby: 'きょうめいきょうしん', baseType: 'special', cost: '8', types: ['action'], text: '【常時】このカードの消費は相手のオーラの数だけ少なくなる。\n相オーラ→間合：2'}
    , '02-saine-o-s-3': {megami: 'saine', name: '音無砕氷', ruby: 'おとなしさいひょう', baseType: 'special', cost: '2', types: ['attack', 'reaction'], range: "0-10", damage: '1/1', text: '対応した《攻撃》は-1/-1となる。\n【再起】八相-あなたのオーラが0である。'}
    , '02-saine-o-s-4': {megami: 'saine', name: '氷雨細音の果ての果て', ruby: 'ひさめさいねのはてのはて', baseType: 'special', cost: '5', types: ['attack', 'reaction'], range: '1-5', damage: '5/5', text: '【常時】このカードは切札に対する対応でしか使用できない。'}

    , '03-himika-o-n-1': {megami: 'himika', name: 'シュート', ruby: '', baseType: 'normal', types: ['attack'], range: "4-10", damage: '2/1', text: ''}
    , '03-himika-o-n-2': {megami: 'himika', name: 'ラピッドファイア', ruby: '', baseType: 'normal', types: ['attack'], range: "7-8", damage: '2/1', text: '【常時】連火-このカードがこのターンに使用した3枚目以降のカードならば、この《攻撃》は+1/+1となる。'}
    , '03-himika-o-n-3': {megami: 'himika', name: 'マグナムカノン', ruby: '', baseType: 'normal', types: ['attack'], range: "5-8", damage: '3/2', text: '【攻撃後】自ライフ→ダスト：1'}
    , '03-himika-o-n-4': {megami: 'himika', name: 'フルバースト', ruby: '', baseType: 'normal', types: ['attack', 'fullpower'], range: "5-9", damage: '3/1', text: '【常時】この《攻撃》がダメージを与えるならば、相手は片方を選ぶのではなく両方のダメージを受ける。'}
    , '03-himika-o-n-5': {megami: 'himika', name: 'バックステップ', ruby: '', baseType: 'normal', types: ['action'], text: 'カードを1枚引く。\nダスト→間合：1'}
    , '03-himika-o-n-6': {megami: 'himika', name: 'バックドラフト', ruby: '', baseType: 'normal', types: ['action'], text: '相手を畏縮させる。\n連火-このカードがこのターンに使用した3枚目以降のカードならば、このターンにあなたが次に行う他のメガミによる《攻撃》を+1/+1する。'}
    , '03-himika-o-n-7': {megami: 'himika', name: 'スモーク', ruby: '', baseType: 'normal', types: ['enhance'], capacity: '3', text: '【展開中】カードの矢印(→)により間合にある桜花結晶は移動しない。'}
    , '03-himika-o-s-1': {megami: 'himika', name: 'レッドバレット', ruby: '', baseType: 'special', cost: '0', types: ['attack'], range: '5-10', damage: '3/1', text: ''}
    , '03-himika-o-s-2': {megami: 'himika', name: 'クリムゾンゼロ', ruby: '', baseType: 'special', cost: '5', types: ['attack'], range: '0-2', damage: '2/2', text: '【常時】この《攻撃》がダメージを与えるならば、相手は片方を選ぶのではなく両方のダメージを受ける。\n【常時】現在の間合が0ならば、この《攻撃》は対応不可を得る。'}
    , '03-himika-o-s-3': {megami: 'himika', name: 'スカーレットイマジン', ruby: '', baseType: 'special', cost: '3', types: ['action'], text: 'カードを2枚引く。その後、あなたは手札を1枚伏せ札にする。'}
    , '03-himika-o-s-4': {megami: 'himika', name: 'ヴァーミリオンフィールド', ruby: '', baseType: 'special', cost: '2', types: ['action'], text: '連火-このカードがこのターンに使用した3枚目以降のカードならば、ダスト→間合：2\n【再起】あなたの手札が0枚である。'}

    , '04-tokoyo-o-n-1': {megami: 'tokoyo', name: '梳流し', ruby: 'すきながし', baseType: 'normal', types: ['attack'], range: '4', damage: '-/1', text: '【攻撃後】境地-あなたの集中力が2ならば、このカードを山札の上に戻す。'}
    , '04-tokoyo-o-n-2': {megami: 'tokoyo', name: '雅打ち', ruby: 'みやびうち', baseType: 'normal', types: ['attack'], range: '2-4', damage: '2/1', text: '【攻撃後】境地-あなたの集中力が2ならば、対応した切札でない《攻撃》を打ち消す。'}
    , '04-tokoyo-o-n-3': {megami: 'tokoyo', name: '跳ね兎', ruby: 'はねうさぎ', baseType: 'normal', types: ['action'], text: '現在の間合が3以下ならば、ダスト→間合：2'}
    , '04-tokoyo-o-n-4': {megami: 'tokoyo', name: '詩舞', ruby: 'しぶ', baseType: 'normal', types: ['action', 'reaction'], text: '集中力を1得て、以下から1つを選ぶ。\n・自フレア→自オーラ：1\n・自オーラ→間合：1'}
    , '04-tokoyo-o-n-5': {megami: 'tokoyo', name: '要返し', ruby: 'かなめがえし', baseType: 'normal', types: ['action', 'fullpower'], text: '捨て札か伏せ札からカードを2枚まで選ぶ。それらのカードを好きな順で山札の底に置く。 \nダスト→自オーラ：2'}
    , '04-tokoyo-o-n-6': {megami: 'tokoyo', name: '風舞台', ruby: 'かぜぶたい', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時】間合→自オーラ：2 \n【破棄時】自オーラ→間合：2'}
    , '04-tokoyo-o-n-7': {megami: 'tokoyo', name: '晴舞台', ruby: 'はれぶたい', baseType: 'normal', types: ['enhance'], capacity: '1', text: '【破棄時】境地-あなたの集中力が2ならば、ダスト→自オーラ：2 \n【破棄時】境地-あなたは集中力を1得る。'}
    , '04-tokoyo-o-s-1': {megami: 'tokoyo', name: '久遠ノ花', ruby: 'くおんのはな', baseType: 'special', types: ['attack'], range: '0-10', damage: '-/1', cost: '5', text: '【攻撃後】対応した《攻撃》を打ち消す。'}
    , '04-tokoyo-o-s-2': {megami: 'tokoyo', name: '千歳ノ鳥', ruby: 'ちとせのとり', baseType: 'special', types: ['attack'], range: '3-4', damage: '2/2', cost: '2', text: '【攻撃後】山札を再構成する。 \n(その際にダメージは受けない)'}
    , '04-tokoyo-o-s-3': {megami: 'tokoyo', name: '無窮ノ風', ruby: 'むきゅうのかぜ', baseType: 'special', types: ['attack'], range: '3-8', damage: '1/1', cost: '1', text: '対応不可 \n【攻撃後】相手は手札から《攻撃》でないカード1枚を捨て札にする。それが行えない場合、相手は手札を公開する。 \n\n【再起】境地-あなたの集中力が2である。'}
    , '04-tokoyo-o-s-4': {megami: 'tokoyo', name: '常世ノ月', ruby: 'とこよのつき', baseType: 'special', types: ['action'], cost: '2', text: 'あなたの集中力は2になり、相手の集中力は0になり、相手を畏縮させる。'}

    , '05-oboro-o-n-1': {megami: 'oboro', name: '鋼糸', ruby: 'こうし', baseType: 'normal', types: ['attack'], range: '3-4', damage: '2/2', text: '設置'}
    , '05-oboro-o-n-2': {megami: 'oboro', name: '影菱', ruby: 'かげびし', baseType: 'normal', types: ['attack'], range: '2', damage: '2/1', text: '設置　対応不可\n【攻撃後】このカードを伏せ札から使用したならば、相手の手札を見てその中から1枚を選び、それを伏せ札にする。'}
    , '05-oboro-o-n-3': {megami: 'oboro', name: '斬撃乱舞', ruby: 'ざんげきらんぶ', baseType: 'normal', types: ['attack', 'fullpower'], range: '2-4', damage: '3/2', text: '【常時】相手がこのターン中にオーラへのダメージを受けているならば、この《攻撃》は+1/+1となる。'}
    , '05-oboro-o-n-4': {megami: 'oboro', name: '忍歩', ruby: 'にんぽ', baseType: 'normal', types: ['action'], text: '設置 \n間合⇔ダスト：1 \nこのカードを伏せ札から使用したならば、伏せ札から設置を持つカードを1枚使用してもよい。'}
    , '05-oboro-o-n-5': {megami: 'oboro', name: '誘導', ruby: 'ゆうどう', baseType: 'normal', types: ['action', 'reaction'], text: '設置\n以下から１つを選ぶ。\n・間合→相オーラ：1\n・相オーラ→相フレア：1'}
    , '05-oboro-o-n-6': {megami: 'oboro', name: '分身の術', ruby: 'ぶんしんのじゅつ', baseType: 'normal', types: ['action', 'fullpower'], text: '伏せ札から《全力》でないカードを1枚選び、そのカードを使用する。その後、そのカードが捨て札にあるならば捨て札からもう1回使用する。《攻撃》カードが使用されたならばそれらの《攻撃》は対応不可を得る（2回ともに対応不可を得る）。'}
    , '05-oboro-o-n-7': {megami: 'oboro', name: '生体活性', ruby: 'せいたいかっせい', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙　設置 \n【破棄時】あなたの使用済の切札を1枚選び、それを未使用に戻す。'}
    , '05-oboro-o-s-1': {megami: 'oboro', name: '熊介', ruby: 'くますけ', baseType: 'special', types: ['attack', 'fullpower'], range: '3-4', damage: '2/2', cost: '4', text: '【攻撃後】攻撃『適正距離3-4、2/2』をX回行う。Xはあなたの伏せ札の枚数に等しい。'}
    , '05-oboro-o-s-2': {megami: 'oboro', name: '鳶影', ruby: 'とびかげ', baseType: 'special', types: ['action', 'reaction'], cost: '3', text: '伏せ札から《全力》でないカードを1枚選び、そのカードを使用してもよい。この際、このカードが対応している《攻撃》があるならば、使用されたカードはそれに対応しているものと扱う。'}
    , '05-oboro-o-s-3': {megami: 'oboro', name: '虚魚', ruby: 'うろうお', baseType: 'special', types: ['action'], cost: '4', text: '【使用済】あなたは1回の再構成に対して、設置を持つカードを任意の枚数、任意の順で使用できる。'}
    , '05-oboro-o-s-4': {megami: 'oboro', name: '壬蔓', ruby: 'みかずら', baseType: 'special', types: ['action'], cost: '0', text: '相オーラ→自フレア：1 \n再起：あなたのフレアが0である。'}

    , '06-yukihi-o-n-1': {megami: 'yukihi', name: 'しこみばり / ふくみばり', ruby: '', baseType: 'normal', types: ['attack'], range: '4-6', rangeOpened: '0-2', damage: '3/1', damageOpened: '1/2', text: '', textOpened: ''}
    , '06-yukihi-o-n-2': {megami: 'yukihi', name: 'しこみび / ねこだまし', ruby: '', baseType: 'normal', types: ['attack'], range: '5-6', rangeOpened: '0-2', damage: '1/1', damageOpened: '1/1', text: '【攻撃後】このカードを手札に戻し、傘の開閉を行う。 ', textOpened: ''}
    , '06-yukihi-o-n-3': {megami: 'yukihi', name: 'ふりはらい / たぐりよせ', ruby: '', baseType: 'normal', types: ['attack'], range: '2-5', rangeOpened: '0-2', damage: '1/1', damageOpened: '1/1', text: '【攻撃後】ダスト⇔間合：1 ', textOpened: '【攻撃後】間合→ダスト：2'}
    , '06-yukihi-o-n-4': {megami: 'yukihi', name: 'ふりまわし / つきさし', ruby: '', baseType: 'normal', types: ['attack', 'fullpower'], range: '4-6', rangeOpened: '0-2', damage: '5/-', damageOpened: '-/2', text: '', textOpened: ''}
    , '06-yukihi-o-n-5': {megami: 'yukihi', name: 'かさまわし', ruby: '', baseType: 'normal', types: ['action'], text: '(このカードは使用しても効果はない) \n【常時】あなたが傘の開閉を行った時、このカードを手札から公開してもよい。そうした場合、 \nダスト→自オーラ：1\n', textOpened: ''}
    , '06-yukihi-o-n-6': {megami: 'yukihi', name: 'ひきあし / もぐりこみ', ruby: '', baseType: 'normal', types: ['action', 'reaction'], text: '', textOpened: ''}
    , '06-yukihi-o-n-7': {megami: 'yukihi', name: 'えんむすび', ruby: '', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開時】間合→ダスト：1 \n【破棄時】ダスト→間合：1 \n【常時】あなたの傘が開いているならば、このカードの矢印(→)は逆になる。', textOpened: ''}
    , '06-yukihi-o-s-1': {megami: 'yukihi', name: 'はらりゆき', ruby: '', baseType: 'special', types: ['attack'], range: '3-5', rangeOpened: '0-1', damage: '3/1', damageOpened: '0/0', cost: '2', text: '【即再起】あなたが傘の開閉を行う。 ', textOpened: ''}
    , '06-yukihi-o-s-2': {megami: 'yukihi', name: 'ゆらりび', ruby: '', baseType: 'special', types: ['attack'], range: '4-6', rangeOpened: '0', damage: '0/0', damageOpened: '4/5', cost: '5', text: '', textOpened: ''}
    , '06-yukihi-o-s-3': {megami: 'yukihi', name: 'どろりうら', ruby: '', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '7', cost: '3', text: '【展開中】あなたのユキヒの《攻撃》は傘を開いた状態と傘を閉じた状態両方の適正距離を持つ。', textOpened: ''}
    , '06-yukihi-o-s-4': {megami: 'yukihi', name: 'くるりみ', ruby: '', baseType: 'special', types: ['action', 'reaction'], cost: '1', text: '傘の開閉を行う。 \nダスト→自オーラ：1', textOpened: ''}
                
    , '09-chikage-o-n-1': {megami: 'chikage', name: '飛苦無', ruby: 'とびくない', baseType: 'normal', types: ['attack'], range: '4-5', damage: '2/2', text: ''}
    , '09-chikage-o-n-2': {megami: 'chikage', name: '毒針', ruby: 'どくばり', baseType: 'normal', types: ['attack'], range: '4', damage: '1/1', text: '【攻撃後】毒袋から「麻痺毒」「幻覚毒」「弛緩毒」のいずれか1枚を選び、そのカードを相手の山札の一番上に置く。'}
    , '09-chikage-o-n-3': {megami: 'chikage', name: '遁術', ruby: 'とんじゅつ', baseType: 'normal', types: ['attack', 'reaction'], range: '1-3', damage: '1/-', text: '【攻撃後】自オーラ→間合：2 \n【攻撃後】このターン中、全てのプレイヤーは基本動作《前進》を行えない。'}
    , '09-chikage-o-n-4': {megami: 'chikage', name: '首切り', ruby: 'くびきり', baseType: 'normal', types: ['attack', 'fullpower'], range: '0-3', damage: '2/3', text: '【攻撃後】相手の手札が2枚以上あるならば、相手は手札を1枚捨て札にする。'}
    , '09-chikage-o-n-5': {megami: 'chikage', name: '毒霧', ruby: 'どくぎり', baseType: 'normal', types: ['action'], text: '毒袋から「麻痺毒」「幻覚毒」「弛緩毒」のいずれか1枚を選び、そのカードを相手の手札に加える。'}
    , '09-chikage-o-n-6': {megami: 'chikage', name: '抜き足', ruby: 'ぬきあし', baseType: 'normal', types: ['enhance'], capacity: '4', text: '隙 \n【展開中】現在の間合は2減少する。 \n(間合は0未満にならない)'}
    , '09-chikage-o-n-7': {megami: 'chikage', name: '泥濘', ruby: 'でいねい', baseType: 'normal', types: ['enhance'], capacity: '2', text: '【展開中】相手は基本動作《後退》と《離脱》を行えない。'}
    , '09-chikage-o-s-1': {megami: 'chikage', name: '滅灯の魂毒', ruby: 'ほろびのみたまどく', baseType: 'special', types: ['action'], cost: '3', text: '毒袋から「滅灯毒」を1枚を選び、そのカードを相手の山札の一番上に置く。'}
    , '09-chikage-o-s-2': {megami: 'chikage', name: '叛旗の纏毒', ruby: 'はんきのまといどく', baseType: 'special', types: ['enhance', 'reaction'], capacity: '5', cost: '2', text: '【展開中】相手によるオーラへのダメージかライフへのダメージのどちらかが「-」である《攻撃》は打ち消される。'}
    , '09-chikage-o-s-3': {megami: 'chikage', name: '流転の霞毒', ruby: 'るてんのかすみどく', baseType: 'special', types: ['attack'], range: '3-7', damage: '1/2', cost: '1', text: '再起：相手の手札が2枚以上ある。'}
    , '09-chikage-o-s-4': {megami: 'chikage', name: '闇昏千影の生きる道', ruby: 'やみくらちかげのいきるみち', baseType: 'special', types: ['enhance', 'fullpower'], capacity: '4', cost: '5', text: '【展開中】あなたが1以上のライフへのダメージを受けた時、このカードの上の桜花結晶は全てダストに送られ、このカードは未使用に戻る。 \n(破棄時効果は失敗する) \n【破棄時】あなたの他の切札が全て使用済ならば、あなたは勝利する。'}
    , '09-chikage-o-p-1': {megami: 'chikage', name: '麻痺毒', ruby: 'まひどく', baseType: 'extra', types: ['action'], text: '毒（このカードは伏せ札にできない） \n【常時】このターン中にあなたが基本動作を行ったならば、このカードは使用できない。 \nこのカードを相手の毒袋に戻す。その後、このフェイズを終了する。'}
    , '09-chikage-o-p-2': {megami: 'chikage', name: '幻覚毒', ruby: 'げんかくどく', baseType: 'extra', types: ['action'], text: '毒（このカードは伏せ札にできない） \nこのカードを相手の毒袋に戻す。 \n自フレア→ダスト：2'}
    , '09-chikage-o-p-3': {megami: 'chikage', name: '弛緩毒', ruby: 'しかんどく', baseType: 'extra', types: ['enhance'], capacity: '3', text: '毒（このカードは伏せ札にできない） \n【展開中】あなたは《攻撃》カードを使用できない。 \n【破棄時】このカードを相手の毒袋に戻す。'}
    , '09-chikage-o-p-4': {megami: 'chikage', name: '滅灯毒', ruby: 'ほろびどく', baseType: 'extra', types: ['action'], text: '毒（このカードは伏せ札にできない） \n自オーラ→ダスト：3'}
    
    // , '99-xxx-o-n-1': {megami: 'xxx', name: '　', ruby: '　', baseType: 'normal', types: ['attack'], range: " ", damage: '-/-', text: ''}
    // , '99-xxx-o-s-1': {megami: 'xxx', name: '　', ruby: '　', baseType: 'special', cost: '5', types: ['attack'], range: ' ', damage: '-/-', text: ''}

};


// socket.io用イベント
export namespace SocketParam {
    export type appendActionLog = {boardId: string, log: state.LogRecord};
    export type bcAppendActionLog = {log: state.LogRecord};

    export type appendChatLog = {boardId: string, log: state.LogRecord};
    export type bcAppendChatLog = {log: state.LogRecord};
}

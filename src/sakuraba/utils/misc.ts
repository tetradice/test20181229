import * as sakuraba from "sakuraba";
import { h } from "hyperapp";
import i18next = require("i18next");
import { t } from "i18next";

/** プレイヤーサイドを逆にする */
export function flipSide(side: PlayerSide): PlayerSide{
  if(side === 'p1') return 'p2';
  if(side === 'p2') return 'p1';
  return side;
}

/** カードの適切な公開状態を判定 */
export function judgeCardOpenState(
      cardSet: CardSet
    , card: state.Card
    , handOpenFlag: boolean
    , cardSide?: PlayerSide
    , cardRegion?: CardRegion
): CardOpenState{
    if(cardSide === undefined) cardSide = card.side;
    if(cardRegion === undefined) cardRegion = card.region;
    let cardData = sakuraba.CARD_DATA[cardSet][card.cardId];

    if(cardRegion === 'used' || cardRegion === 'on-card' || cardRegion === 'extra' || (cardData.baseType === 'special' && card.specialUsed)){
        // カードが使用済み領域にある場合か、封印済みか、追加札か、切り札で使用済みフラグがONの場合、公開済み
        return 'opened';
    } else if(cardRegion === 'hand'){
        // 手札にあれば、所有者のみ表示可能
        // ただし手札オープンフラグがONの場合は全体公開
        return (handOpenFlag ? 'opened' : 'ownerOnly');
    }
    // 上記以外の場合は裏向き
    return 'hidden';
}



/**
 * 改行を<br>に変換
 */
export function nl2br(str: string): string {
    return str.replace(/\n/g, '<br>');
}

/**
 * 改行を<br>に変換し、JSX要素のリストとして返す
 */
export function nl2brJsx(str: string): hyperapp.Children[] {
    let lines = str.split(/\n/g);
    let ret: hyperapp.Children[] = [];
    let firstLine = true;
    lines.forEach(line => {
        if(!firstLine){
            ret.push(h('br'));
        }
        ret.push(line);
        firstLine = false;
    });

    return ret;
}

/** 指定したオブジェクトをfirestoreに保存可能な形式に変換 */
export function convertForFirestore<T>(target: T): T{
    let newValue = convertValueForFirestore(target);
    console.log('convert %o -> %o', target, newValue);
    return newValue;
}

/** 指定した値をfirestoreに保存可能な形式に変換 */
export function convertValueForFirestore(value: any){
    // undefined, 関数は無視 (すべてundefinedに変換する)
    if (value === undefined || typeof value === 'function') {
        return undefined;
    }

    // nullはそのまま返す
    if(value === null){
        return value;
    }

    // 配列、objectは再帰的に処理
    if (Array.isArray(value)) {
        return value.map(x => convertValueForFirestore(x));
    }
    if (typeof value === 'object') {
        let ret = {};
        for (let key of Object.keys(value)) {
            let newValue = convertValueForFirestore(value[key]);
            if(newValue !== undefined){
                ret[key] = newValue;
            }
        };
        return ret;
    }

    // それ以外の値はそのまま
    return value;
}
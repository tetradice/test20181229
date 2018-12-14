import * as sakuraba from "sakuraba";
import { h } from "hyperapp";
import i18next = require("i18next");

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

/** カードのリージョン名を取得 */
export function getCardRegionTitle(
      selfSide: PlayerSide
    , side: PlayerSide
    , region: CardRegion
    , cardSet: CardSet
    , linkedCard: state.Card
){
    let titleBase = ``;
    if(region === 'hand'){
        titleBase = "手札";
    }
    if(region === 'hidden-used'){
        titleBase = "伏せ札";
    }
    if(region === 'library'){
        titleBase = "山札";
    }
    if(region === 'special'){
        titleBase = "切り札";
    }
    if(region === 'used'){
        titleBase = "使用済み";
    }
    if(region === 'extra'){
        titleBase = "追加札";
    }
    if(region === 'on-card'){
        let cardData = sakuraba.CARD_DATA[cardSet][linkedCard.cardId];
        titleBase = `[${cardData.name}]の下`;
    }

    // 相手側に移動した場合は、「相手の」をつける
    if(selfSide !== side){
        return `相手の${titleBase}`
    } else {
        return titleBase;
    }
}

/** 桜花結晶のリージョン名を取得 */
export function getSakuraTokenRegionTitle(
      selfSide: PlayerSide
    , side: PlayerSide
    , region: SakuraTokenRegion
    , cardSet: CardSet
    , linkedCard: state.Card
){
    let titleBase = ``;
    if(region === 'aura'){
        titleBase = "オーラ";
    }
    if(region === 'life'){
        titleBase = "ライフ";
    }
    if(region === 'flair'){
        titleBase = "フレア";
    }
    if(region === 'distance'){
        titleBase = "間合";
    }
    if(region === 'dust'){
        titleBase = "ダスト";
    }
    if(region === 'machine'){
        titleBase = "マシン";
    }
    if(region === 'burned'){
        titleBase = "燃焼済";
    }
    if (region === 'out-of-game') {
        titleBase = "ゲーム外";
    }
    if(region === 'on-card'){
        let cardData = sakuraba.CARD_DATA[cardSet][linkedCard.cardId];
        titleBase = `[${cardData.name}]上`;
    }

    // 相手側に移動した場合は、「相手の」をつける
    if(selfSide !== side && side !== null){
        return `相手の${titleBase}`
    } else {
        return titleBase;
    }
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
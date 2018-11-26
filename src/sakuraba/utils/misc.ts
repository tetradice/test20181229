import * as sakuraba from "sakuraba";
import * as models from "sakuraba/models";
import { t } from "i18next";

/** プレイヤーサイドを逆にする */
export function flipSide(side: PlayerSide): PlayerSide{
  if(side === 'p1') return 'p2';
  if(side === 'p2') return 'p1';
  return side;
}

/** メガミの表示名を取得 */
export function getMegamiDispName(megami: sakuraba.Megami): string{
    let data = sakuraba.MEGAMI_DATA[megami];
    if(data.base !== undefined){
        return `${data.name}(${data.symbol})`
    } else {
        return `${data.name}(${data.symbol})`
    }
}

/** ログを表示できるかどうか判定 */
export function logIsVisible(log: state.LogRecord, side: SheetSide): boolean{
    if(log.visibility === 'shown') return true;
    if(log.visibility === 'ownerOnly' && log.side === side) return true;
    if(log.visibility === 'outerOnly' && log.side !== side) return true;
    return false;
}

/** カードの適切な公開状態を判定 */
export function judgeCardOpenState(
      card: state.Card
    , handOpenFlag: boolean
    , cardSide?: PlayerSide
    , cardRegion?: CardRegion
): CardOpenState{
    if(cardSide === undefined) cardSide = card.side;
    if(cardRegion === undefined) cardRegion = card.region;
    let cardData = sakuraba.CARD_DATA[card.cardId];

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

/** カードの説明用ポップアップHTMLを取得する */
export function getDescriptionHtml(cardData: models.CardData): string{
  let cardTitleHtml = `<ruby><rb>${cardData.name}</rb><rp>(</rp><rt>${cardData.ruby}</rt><rp>)</rp></ruby>`
  let html = `<div class='ui header' style='margin-right: 2em;'>${cardTitleHtml}`

  html += `</div><div class='ui content'>`
  if(cardData.baseType === 'special'){
    html += `<div class='ui top right attached label'>${cardData.language === 'en' ? 'Cost' : '消費'}: ${cardData.cost}</div>`;
  }

  let closedSymbol = (cardData.language === 'en' ? '[C]' : '[閉]');
  let openedSymbol = (cardData.language === 'en' ? '[O]' : '[開]');

  let typeCaptions = [];
  if(cardData.types.indexOf('attack') >= 0) typeCaptions.push(`<span class='card-type-attack'>${cardData.language === 'en' ? 'ATK' : '攻撃'}</span>`);
  if(cardData.types.indexOf('action') >= 0) typeCaptions.push(`<span class='card-type-action'>${cardData.language === 'en' ? 'ACT' : '行動'}</span>`);
  if(cardData.types.indexOf('enhance') >= 0) typeCaptions.push(`<span class='card-type-enhance'>${cardData.language === 'en' ? 'ENH' : '付与'}</span>`);
  if(cardData.types.indexOf('variable') >= 0) typeCaptions.push(`<span class='card-type-variable'>${cardData.language === 'en' ? '?' : '不定'}</span>`);
  if(cardData.types.indexOf('reaction') >= 0) typeCaptions.push(`<span class='card-type-reaction'>${cardData.language === 'en' ? 'REA' : '対応'}</span>`);
  if(cardData.types.indexOf('fullpower') >= 0) typeCaptions.push(`<span class='card-type-fullpower'>${cardData.language === 'en' ? 'THR' : '全力'}</span>`);
  if(cardData.types.indexOf('transform') >= 0) typeCaptions.push(`<span class='card-type-transform'>Transform</span>`);
  html += `${typeCaptions.join('/')}`;
  if(cardData.range !== undefined){
      if(cardData.rangeOpened !== undefined){
        html += `<span style='margin-left: 1em;'>${cardData.language === 'en' ? 'Range' : '適正距離'} ${closedSymbol}${cardData.range} ${openedSymbol}${cardData.rangeOpened}</span>`
      } else {
        html += `<span style='margin-left: 1em;'>${cardData.language === 'en' ? 'Range' : '適正距離'}${cardData.range}</span>`;
      }
  }
  html += `<br>`;
  if(cardData.types.indexOf('enhance') >= 0){
      html += `${cardData.language === 'en' ? 'Charge' : '納'}: ${cardData.capacity}<br>`;
  }

  if(cardData.damageOpened !== undefined){
    // 傘の開閉によって効果が分かれる攻撃カード
    html += `${closedSymbol} ${cardData.damage}<br>`;
    html += `${cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
    html += (cardData.text ? '<br>' : '');
    html += `${openedSymbol} ${cardData.damageOpened}<br>`;
    html += `${cardData.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
  } else if(cardData.textOpened) {
    // 傘の開閉によって効果が分かれる非攻撃カード
    html += `${closedSymbol} ${cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
    html += (cardData.text ? '<br>' : '');
    html += `${openedSymbol} ${cardData.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;

  } else {
    if(cardData.damage !== undefined){
        html += `${cardData.damage}<br>`;
    }
    html += `${cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
  }
  html += `</div>`;

  if(cardData.megami === 'kururu'){
    html = html.replace(/<([攻行付対全]+)>/g, (str, arg) => {
        let replaced = arg.replace(/攻+/, (str2) => `<span class='card-type-attack'>${cardData.language === 'en' ? 'ATK ' : str2}</span>`)
                          .replace(/行+/, (str2) => `<span class='card-type-action'>${cardData.language === 'en' ? 'ACT ' : str2}</span>`)
                          .replace(/付+/, (str2) => `<span class='card-type-enhance'>${cardData.language === 'en' ? 'ENH ' : str2}</span>`)
                          .replace(/対+/, (str2) => `<span class='card-type-reaction'>${cardData.language === 'en' ? 'REA ' : str2}</span>`)
                          .replace(/全+/, (str2) => `<span class='card-type-fullpower'>${cardData.language === 'en' ? 'THR ' : str2}</span>`)
        return `<${replaced}>`;
    });
  }

  return html;
}

/** カードのリージョン名を取得 */
export function getCardRegionTitle(selfSide: PlayerSide, side: PlayerSide, region: CardRegion, linkedCard: state.Card){
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
        let cardData = sakuraba.CARD_DATA[linkedCard.cardId];
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
export function getSakuraTokenRegionTitle(selfSide: PlayerSide, side: PlayerSide, region: SakuraTokenRegion, linkedCard?: state.Card){
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
    if(region === 'on-card'){
        let cardData = sakuraba.CARD_DATA[linkedCard.cardId];
        titleBase = `[${cardData.name}]上`;
    }

    // 相手側に移動した場合は、「相手の」をつける
    if(selfSide !== side && side !== null){
        return `相手の${titleBase}`
    } else {
        return titleBase;
    }
}


// ログテキストオブジェクトを翻訳する (パラメータの中に翻訳対象オブジェクトが含まれていれば再帰的に翻訳)
export function translateLog(log: LogValue): string{
    if(typeof log === 'string'){
        return log;
    } else if(Array.isArray(log)){
        let [key, givenParams] = log;

        let params = {};
        for(let k in givenParams){
            params[k] = translateLog(givenParams[k]); // 再帰処理
        }
        return t(key, params);
    } else {
        if(log.type === 'cardName'){
            let cardData = new models.CardData(log['cardId'], 'ja');
            return cardData.name;
        }
        return undefined;
    }
}
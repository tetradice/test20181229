import * as sakuraba from "sakuraba";
import * as models from "sakuraba/models";
import { t } from "i18next";
import { h } from "hyperapp";
import { ActionLogRecord } from "sakuraba/typings/state";

/** プレイヤーサイドを逆にする */
export function flipSide(side: PlayerSide): PlayerSide{
  if(side === 'p1') return 'p2';
  if(side === 'p2') return 'p1';
  return side;
}

/** 指定したカードセットに対応するメガミのキー一覧を取得 */
export function getMegamiKeys(cardSet: CardSet): sakuraba.Megami[]{
    let keys: sakuraba.Megami[] = [];
    for(let key in sakuraba.MEGAMI_DATA){
        let megami = sakuraba.MEGAMI_DATA[key as sakuraba.Megami];
        if(megami.notExistCardSets === undefined || megami.notExistCardSets.indexOf(cardSet) === -1){
            keys.push(key as sakuraba.Megami);
        }
    }

    return keys;
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
  // 追加札で、かつ追加元が指定されている場合
  if(cardData.extra && cardData.extraFrom){
      let extraCardData = sakuraba.CARD_DATA[cardData.cardSet][cardData.extraFrom];
      html += `<div class="extra-from">追加 ≫ ${extraCardData.name}</div>`
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

// パラメータとして渡されたログ値を、保存用の形式に変換する
export function convertLogValueForState(val: LogValue): state.ActionLogBody{
    let params: { [key: string]: state.ActionLogBody } = {};
    if(val[1] !== null){
        for(let paramName in val[1]){
            params[paramName] = convertLogParamValueForState(val[1][paramName]);
        }
    }

    return { type: 'ls', key: val[0], params: params};
}

function convertLogParamValueForState(val: LogParamValue): state.ActionLogBody {
    if(typeof val === 'string' || typeof val === 'number'){
        return val.toString();
    } else if(Array.isArray(val)){
        return convertLogValueForState(val);
    } else {
        return { type: 'cn', cardId: val.cardId, cardSet: val.cardSet };
    }
}

// ログオブジェクトを翻訳する (パラメータの中に翻訳対象オブジェクトが含まれていれば再帰的に翻訳)
export function translateLog(log: state.ActionLogBody): string{
    if(!log) return "";

    let buf = "";
    if(Array.isArray(log)){
        // 配列が渡された場合、全要素を翻訳して結合
        return log.map(x => translateLog(x)).join('');

    } else {
        // 固定文字列
        if(typeof log === 'string'){
            return log;
        }

        // 翻訳対象文字列
        if(log.type === 'ls'){

            let params = {};
            for (let k in log.params) {
                params[k] = translateLog(log.params[k]); // パラメータも再帰的に翻訳する
            }

            // i18nextで翻訳した結果を返す
            return t(log.key, params);
        }

        // カード名
        if (log.type === 'cn') {
            let cardData = new models.CardData(log.cardSet, log.cardId, 'ja');
            return cardData.name;
        }
    }

    return undefined;
}

export function nl2br(str: string): string {
    return str.replace(/\n/g, '<br>');
}

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
import * as sakuraba from "sakuraba";

/** プレイヤーサイドを逆にする */
export function flipSide(side: PlayerSide): PlayerSide{
  if(side === 'p1') return 'p2';
  if(side === 'p2') return 'p1';
  return side;
}

/** メガミの表示名を取得 */
export function getMegamiDispName(megami: sakuraba.Megami): string{
    let data = sakuraba.MEGAMI_DATA[megami];
    return `${data.name}(${data.symbol})`
}

/** ログを表示できるかどうか判定 */
export function logIsVisible(log: state.LogRecord, side: PlayerSide): boolean{
    if(log.visibility === 'shown') return true;
    if(log.visibility === 'ownerOnly' && log.playerSide === side) return true;
    if(log.visibility === 'outerOnly' && log.playerSide !== side) return true;
    return false;
}

/** カードの適切な公開状態を判定 */
export function judgeCardOpenState(
      card: state.Card
    , cardSide?: PlayerSide
    , cardRegion?: CardRegion
): CardOpenState{
    if(cardSide === undefined) cardSide = card.side;
    if(cardRegion === undefined) cardRegion = card.region;
    let cardData = sakuraba.CARD_DATA[card.cardId];

    if(cardRegion === 'used' || (cardData.baseType === 'special' && card.specialUsed)){
        // カードが使用済み領域にある場合か、切り札で使用済みフラグがONの場合、公開済み
        return 'opened';
    } else if(cardRegion === 'hand'){
        // 手札にあれば、所有者のみ表示可能
        return 'ownerOnly';
    }

    // 上記以外の場合は裏向き
    return 'hidden';
}

/** カードの説明用ポップアップHTMLを取得する */
export function getDescriptionHtml(cardId: string): string{
  let cardData = sakuraba.CARD_DATA[cardId];
  let cardTitleHtml = `<ruby><rb>${cardData.name}</rb><rp>(</rp><rt>${cardData.ruby}</rt><rp>)</rp></ruby>`
  let html = `<div class='ui header' style='margin-right: 2em;'>${cardTitleHtml}`

  html += `</div><div class='ui content'>`
  if(cardData.baseType === 'special'){
    html += `<div class='ui top right attached label'>消費: ${cardData.cost}</div>`;
  }

  let typeCaptions = [];
  if(cardData.types.indexOf('attack') >= 0) typeCaptions.push("<span style='color: red; font-weight: bold;'>攻撃</span>");
  if(cardData.types.indexOf('action') >= 0) typeCaptions.push("<span style='color: blue; font-weight: bold;'>行動</span>");
  if(cardData.types.indexOf('enhance') >= 0) typeCaptions.push("<span style='color: green; font-weight: bold;'>付与</span>");
  if(cardData.types.indexOf('variable') >= 0) typeCaptions.push("<span style='color: gray; font-weight: bold;'>不定</span>");
  if(cardData.types.indexOf('reaction') >= 0) typeCaptions.push("<span style='color: purple; font-weight: bold;'>対応</span>");
  if(cardData.types.indexOf('fullpower') >= 0) typeCaptions.push("<span style='color: #E0C000; font-weight: bold;'>全力</span>");
  html += `${typeCaptions.join('/')}`;
  if(cardData.range !== undefined){
      if(cardData.rangeOpened !== undefined){
        html += `<span style='margin-left: 1em;'>適正距離 [閉]${cardData.range} [開]${cardData.rangeOpened}</span>`
      } else {
        html += `<span style='margin-left: 1em;'>適正距離${cardData.range}</span>`;
      }
  }
  html += `<br>`;
  if(cardData.types.indexOf('enhance') >= 0){
      html += `納: ${cardData.capacity}<br>`;
  }

  if(cardData.damageOpened !== undefined){
    // 傘の開閉によって効果が分かれる攻撃カード
    html += `[閉] ${cardData.damage}<br>`;
    html += `${cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
    html += (cardData.text ? '<br>' : '');
    html += `[開] ${cardData.damageOpened}<br>`;
    html += `${cardData.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
  } else if(cardData.textOpened) {
    // 傘の開閉によって効果が分かれる非攻撃カード
    html += `[閉] ${cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
    html += (cardData.text ? '<br>' : '');
    html += `[開] ${cardData.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;

  } else {
    if(cardData.damage !== undefined){
        html += `${cardData.damage}<br>`;
    }
    html += `${cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
  }
  html += `</div>`;

  if(cardData.megami === 'kururu'){
    html = html.replace(/<([攻行付対全]+)>/g, (str, arg) => {
        let replaced = arg.replace(/攻+/, (str2) => `<span style='color: red; font-weight: bold;'>${str2}</span>`)
                          .replace(/行+/, (str2) => `<span style='color: blue; font-weight: bold;'>${str2}</span>`)
                          .replace(/付+/, (str2) => `<span style='color: green; font-weight: bold;'>${str2}</span>`)
                          .replace(/対+/, (str2) => `<span style='color: purple; font-weight: bold;'>${str2}</span>`)
                          .replace(/全+/, (str2) => `<span style='color: #E0C000; font-weight: bold;'>${str2}</span>`)
        return `<${replaced}>`;
    });
  }

  return html;
}

/** リージョン名を取得 */
export function getCardRegionTitle(selfSide: PlayerSide, side: PlayerSide, region: CardRegion){
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

    // 相手側に移動した場合は、「相手の」をつける
    if(selfSide !== side){
        return `相手の${titleBase}`
    } else {
        return titleBase;
    }
}
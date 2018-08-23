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

/** カードの説明用ポップアップHTMLを取得する */
export function getDescriptionHtml(cardId: string): string{
  let cardData = sakuraba.CARD_DATA[cardId];
  let cardTitleHtml = `<ruby><rb>${cardData.name}</rb><rp>(</rp><rt>${cardData.ruby}</rt><rp>)</rp></ruby>`
  let html = `<div class='ui header' style='margin-right: 2em;'>${cardTitleHtml}`

  html += `</div><div class='ui content'>`

  let typeCaptions = [];
  if(cardData.types.indexOf('attack') >= 0) typeCaptions.push("<span style='color: red; font-weight: bold;'>攻撃</span>");
  if(cardData.types.indexOf('action') >= 0) typeCaptions.push("<span style='color: blue; font-weight: bold;'>行動</span>");
  if(cardData.types.indexOf('enhance') >= 0) typeCaptions.push("<span style='color: green; font-weight: bold;'>付与</span>");
  if(cardData.types.indexOf('reaction') >= 0) typeCaptions.push("<span style='color: purple; font-weight: bold;'>対応</span>");
  if(cardData.types.indexOf('fullpower') >= 0) typeCaptions.push("<span style='color: #E0C000; font-weight: bold;'>全力</span>");
  html += `${typeCaptions.join('/')}`;
  if(cardData.range !== undefined){
      html += `<span style='margin-left: 1em;'>適正距離${cardData.range}</span>`
  }
  html += `<br>`;
  if(cardData.baseType === 'special'){
      html += `<div class='ui top right attached label'>消費: ${cardData.cost}</div>`;
  }
  if(cardData.types.indexOf('enhance') >= 0){
      html += `納: ${cardData.capacity}<br>`;
  }
  if(cardData.damage !== undefined){
      html += `${cardData.damage}<br>`;
  }
  html += `${cardData.text.replace(/\n/g, '<br>')}`;
  html += `</div>`;
  return html;
}

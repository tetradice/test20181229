import * as sakuraba from "sakuraba";

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
export function getDescriptionHtml(cardSet: CardSet, cardId: string): string{
  let cardData = sakuraba.CARD_DATA[cardSet][cardId];
  let cardTitleHtml = `<ruby><rb>${cardData.name}</rb><rp>(</rp><rt>${cardData.ruby}</rt><rp>)</rp></ruby>`
  let html = `<div class='ui header' style='margin-right: 2em;'>${cardTitleHtml}`

  html += `</div><div class='ui content'>`
  if(cardData.baseType === 'special'){
    html += `<div class='ui top right attached label'>消費: ${cardData.cost}</div>`;
  }

  let typeCaptions = [];
  if(cardData.types.indexOf('attack') >= 0) typeCaptions.push("<span class='card-type-attack'>攻撃</span>");
  if(cardData.types.indexOf('action') >= 0) typeCaptions.push("<span class='card-type-action'>行動</span>");
  if(cardData.types.indexOf('enhance') >= 0) typeCaptions.push("<span class='card-type-enhance'>付与</span>");
  if(cardData.types.indexOf('variable') >= 0) typeCaptions.push("<span class='card-type-variable'>不定</span>");
  if(cardData.types.indexOf('reaction') >= 0) typeCaptions.push("<span class='card-type-reaction'>対応</span>");
  if(cardData.types.indexOf('fullpower') >= 0) typeCaptions.push("<span class='card-type-fullpower'>全力</span>");
  if(cardData.types.indexOf('transform') >= 0) typeCaptions.push("<span class='card-type-transform'>Transform</span>");
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
  // 追加札で、かつ追加元が指定されている場合
  if(cardData.extra && cardData.extraFrom){
      let extraCardData = sakuraba.CARD_DATA[cardSet][cardData.extraFrom];
      html += `<div class="extra-from">追加 ≫ ${extraCardData.name}</div>`
  }
  html += `</div>`;

  if(cardData.megami === 'kururu'){
    html = html.replace(/<([攻行付対全]+)>/g, (str, arg) => {
        let replaced = arg.replace(/攻+/, (str2) => `<span class='card-type-attack'>${str2}</span>`)
                          .replace(/行+/, (str2) => `<span class='card-type-action'>${str2}</span>`)
                          .replace(/付+/, (str2) => `<span class='card-type-enhance'>${str2}</span>`)
                          .replace(/対+/, (str2) => `<span class='card-type-reaction'>${str2}</span>`)
                          .replace(/全+/, (str2) => `<span class='card-type-fullpower'>${str2}</span>`)
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

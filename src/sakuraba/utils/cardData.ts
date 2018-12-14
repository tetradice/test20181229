import * as sakuraba from "sakuraba";
import * as models from "sakuraba/models";

/** 指定したカードセットに対応するメガミのキー一覧を取得 */
export function getMegamiKeys(cardSet: CardSet): sakuraba.Megami[] {
    let keys: sakuraba.Megami[] = [];
    for (let key in sakuraba.MEGAMI_DATA) {
        let megami = sakuraba.MEGAMI_DATA[key as sakuraba.Megami];
        if (megami.notExistCardSets === undefined || megami.notExistCardSets.indexOf(cardSet) === -1) {
            keys.push(key as sakuraba.Megami);
        }
    }

    return keys;
}

// 指定したメガミのカードIDリストを取得
export function getMegamiCardIds(megami: sakuraba.Megami, cardSet: CardSet, baseType: null | sakuraba.CardDataItem['baseType'], includeExtra = false): string[]{
    let ret: string[] = [];

    // 全カードを探索し、指定されたメガミと対応するカードを、カードIDリストへ追加する
    for (let key of sakuraba.ALL_CARD_ID_LIST[cardSet]) {
        let data = sakuraba.CARD_DATA[cardSet][key];
        let megamiData = sakuraba.MEGAMI_DATA[megami];

        let replacedByAnother = sakuraba.ALL_CARD_LIST[cardSet].find(x => x.anotherID !== undefined && x.replace === key);

        if((baseType === null || data.baseType === baseType) && (includeExtra || !data.extra)){
            if(megamiData.anotherID){
                // アナザーメガミである場合の所有カード判定
                // 通常メガミが持ち、かつアナザーで置き換えられていないカードを追加
                if(data.megami === megamiData.base && (data.anotherID === undefined) && !replacedByAnother){
                    ret.push(key);
                }
                // アナザーメガミ用のカードを追加
                if(data.megami === megamiData.base && (data.anotherID === megamiData.anotherID)){
                    ret.push(key);
                }
            } else {
                // 通常メガミである場合、メガミの種類が一致している通常カードを全て追加
                if(data.megami === megami && (data.anotherID === undefined)){
                    ret.push(key);
                }
            }
        }
    }

    return ret;
}

/** カードの説明用ポップアップHTMLを取得する */
export function getDescriptionHtml(cardData: models.CardData): string {
    let cardTitleHtml = `<ruby><rb>${cardData.name}</rb><rp>(</rp><rt>${cardData.ruby}</rt><rp>)</rp></ruby>`
    let html = `<div class='ui header' style='margin-right: 2em;'>${cardTitleHtml}`

    html += `</div><div class='ui content'>`
    if (cardData.baseType === 'special') {
        html += `<div class='ui top right attached label'>${cardData.language === 'en' ? 'Cost' : '消費'}: ${cardData.cost}</div>`;
    }

    let closedSymbol = (cardData.language === 'en' ? '[C]' : '[閉]');
    let openedSymbol = (cardData.language === 'en' ? '[O]' : '[開]');

    let typeCaptions = [];
    if (cardData.types.indexOf('attack') >= 0) typeCaptions.push(`<span class='card-type-attack'>${cardData.language === 'en' ? 'ATK' : '攻撃'}</span>`);
    if (cardData.types.indexOf('action') >= 0) typeCaptions.push(`<span class='card-type-action'>${cardData.language === 'en' ? 'ACT' : '行動'}</span>`);
    if (cardData.types.indexOf('enhance') >= 0) typeCaptions.push(`<span class='card-type-enhance'>${cardData.language === 'en' ? 'ENH' : '付与'}</span>`);
    if (cardData.types.indexOf('variable') >= 0) typeCaptions.push(`<span class='card-type-variable'>${cardData.language === 'en' ? '?' : '不定'}</span>`);
    if (cardData.types.indexOf('reaction') >= 0) typeCaptions.push(`<span class='card-type-reaction'>${cardData.language === 'en' ? 'REA' : '対応'}</span>`);
    if (cardData.types.indexOf('fullpower') >= 0) typeCaptions.push(`<span class='card-type-fullpower'>${cardData.language === 'en' ? 'THR' : '全力'}</span>`);
    if (cardData.types.indexOf('transform') >= 0) typeCaptions.push(`<span class='card-type-transform'>Transform</span>`);
    html += `${typeCaptions.join('/')}`;
    if (cardData.range !== undefined) {
        if (cardData.rangeOpened !== undefined) {
            html += `<span style='margin-left: 1em;'>${cardData.language === 'en' ? 'Range' : '適正距離'} ${closedSymbol}${cardData.range} ${openedSymbol}${cardData.rangeOpened}</span>`
        } else {
            html += `<span style='margin-left: 1em;'>${cardData.language === 'en' ? 'Range' : '適正距離'}${cardData.range}</span>`;
        }
    }
    html += `<br>`;
    if (cardData.types.indexOf('enhance') >= 0) {
        html += `${cardData.language === 'en' ? 'Charge' : '納'}: ${cardData.capacity}<br>`;
    }

    if (cardData.damageOpened !== undefined) {
        // 傘の開閉によって効果が分かれる攻撃カード
        html += `${closedSymbol} ${cardData.damage}<br>`;
        html += `${cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
        html += (cardData.text ? '<br>' : '');
        html += `${openedSymbol} ${cardData.damageOpened}<br>`;
        html += `${cardData.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
    } else if (cardData.textOpened) {
        // 傘の開閉によって効果が分かれる非攻撃カード
        html += `${closedSymbol} ${cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
        html += (cardData.text ? '<br>' : '');
        html += `${openedSymbol} ${cardData.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;

    } else {
        if (cardData.damage !== undefined) {
            html += `${cardData.damage}<br>`;
        }
        html += `${cardData.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
    }
    // 追加札で、かつ追加元が指定されている場合
    if (cardData.extra && cardData.extraFrom) {
        let extraCardData = sakuraba.CARD_DATA[cardData.cardSet][cardData.extraFrom];
        html += `<div class="extra-from">追加 ≫ ${extraCardData.name}</div>`
    }
    html += `</div>`;

    if (cardData.megami === 'kururu') {
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
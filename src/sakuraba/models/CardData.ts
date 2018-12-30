import * as _ from "lodash";
import { CardDataItem, CARD_DATA, S3_UPDATED_CARD_DATA } from "sakuraba";
import { t } from "i18next";

export class CardData {
    /** カードセット */
    cardSet: CardSet;

    /** 対象のカードID */
    cardId: string;

    /** 言語設定 */
    languageSetting: LanguageSetting;

    /** カード画像表示フラグ */
    cardImageEnabled: boolean;

    /** 複製元のカードID */
    duplicatingCardId: string | null = null;

    /** 傘が開いている場合の情報を使用するかどうか */
    usedOpenedCardData: boolean = false;

    constructor(cardSet: CardSet, cardId: string, languageSetting: LanguageSetting, cardImageEnabled: boolean, duplicatingCardId?: string){
        this.cardSet = cardSet;
        this.cardId = cardId;
        this.languageSetting = languageSetting;
        this.cardImageEnabled = cardImageEnabled;
        if(duplicatingCardId){
            this.duplicatingCardId = duplicatingCardId;
        }
    }

    get baseData(): CardDataItem {
        return CARD_DATA[this.cardSet][this.cardId];
    }

    get duplicatingBaseData(): CardDataItem {
        return CARD_DATA[this.cardSet][this.duplicatingCardId];
    }

    /** 言語を元に適切なテキストを選択 */
    selectText(lang: Language, ja: string, zh: string, en: string): string{
        if (lang === 'en') {
            return en;
        }
        if (lang === 'zh-Hans') {
            return zh;
        }
        return ja;
    }

    /** メガミ */
    get megami(): CardDataItem['megami'] {
        let data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
        return data.megami;
    }
    /** カード名 */
    get name(): CardDataItem['name'] {
        return this.selectText(this.languageSetting.uniqueName, this.baseData.name, this.baseData.nameZh, this.baseData.nameEn);
    }
    /** 読み仮名 */
    get ruby(): CardDataItem['ruby'] {
        return this.selectText(this.languageSetting.uniqueName, this.baseData.ruby, '', this.baseData.rubyEn);
    }
    /** 分類 (通常/切札/Transform) */
    get baseType(): CardDataItem['baseType'] {
        return this.baseData.baseType;
    }
    /** タイプ */
    get types(): CardDataItem['types'] {
        let data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
        return data.types;
    }
    /** 消費 */
    get cost(): CardDataItem['cost'] {
        let data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
        return data.cost;
    }

    /** 適正距離 (現在の傘の状態に依存する) */
    get currentRange(): CardDataItem['range'] {
        if(this.usedOpenedCardData){
            return this.rangeOpened;
        } else {
            return this.range;
        }
    }

    /** 適正距離 */
    get range(): CardDataItem['range'] {
        let data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
        return data.range;
    }

    /** 適正距離（傘を開いている場合） */
    get rangeOpened(): CardDataItem['rangeOpened'] {
        let data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
        return data.rangeOpened;
    }

    /** 納 */
    get capacity(): CardDataItem['capacity'] {
        let data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
        return data.capacity;
    }

    /** ダメージ (現在の傘の状態に依存する)  */
    get currentDamage(): CardDataItem['damage'] {
        if(this.usedOpenedCardData){
            return this.damageOpened;
        } else {
            return this.damage;
        }
    }

    /** ダメージ */
    get damage(): CardDataItem['damage'] {
        let data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
        return data.damage;
    }

    /** ダメージ（傘を開いている場合） */
    get damageOpened(): CardDataItem['damageOpened'] {
        let data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
        return data.damageOpened;
    }

    /** 毒フラグ */
    get poison(): CardDataItem['poison'] {
        return this.baseData.poison; // でゅーぷりぎあに毒を複製した場合でも毒扱いにはならない
    }

    /** 説明テキスト */
    get text(): CardDataItem['text'] {
        return this.selectText(this.languageSetting.cardText, this.baseData.text, this.baseData.textZh, this.baseData.textEn);
    }

    /** 説明テキスト */
    get textOpened(): CardDataItem['textOpened'] {
        return this.selectText(this.languageSetting.uniqueName, this.baseData.textOpened, this.baseData.textOpenedZh, this.baseData.textOpenedEn);
    }

    /** 追加札かどうか(デッキ構築の時に選択できず、ゲーム開始時に追加札領域に置かれる) */
    get extra(): CardDataItem['extra'] {
        return this.baseData.extra;
    }
    /** 追加札の追加元 */
    get extraFrom(): CardDataItem['extraFrom'] {
        return this.baseData.exchangableTo;
    }
    /** 追加札の追加元データ */
    get extraFromData(): CardData {
        return new CardData(this.cardSet, this.extraFrom, this.languageSetting, this.cardImageEnabled);
    }
    /** 交換先 */
    get exchangableTo(): CardDataItem['exchangableTo'] {
        return this.baseData.exchangableTo;
    }
    
    /** 交換先データ */
    get exchangableToData(): CardData {
        return new CardData(this.cardSet, this.exchangableTo, this.languageSetting, this.cardImageEnabled);
    }




    /** カード画像のURLを取得 */
    getCardImageUrl(): string {
        let imageName = 'na_' + this.cardId.replace(/-/g, '_').toLowerCase();

        // トランスフォームカードの場合
        if(this.baseType === 'transform'){
            imageName = 'na_' + this.cardId.replace(/-/g, '_').toLowerCase();
        }

        // シーズン3処理
        if(this.cardSet === 'na-s3'){
            // シーズン2に存在し、かつシーズン3で更新があるカードの場合、後ろに_s3を付ける
            if (CARD_DATA['na-s2'][this.cardId] && S3_UPDATED_CARD_DATA[this.cardId]){
                imageName = imageName + '_s3';
            }
            // トコヨ「陽の音」のみ、置換先が変わっているため特殊処理
            if (this.cardId === '04-tokoyo-A1-n-5'){
                imageName = imageName + '_s3';
            }
        }
        return `//inazumaapps.info/furuyoni_simulator/deliv/furuyoni_commons/furuyoni_na/cards/resized/en/${imageName}.png`;
    }

    /** カードの説明用ポップアップHTMLを取得する */
    getDescriptionHtml(): string {
        let html = '';

        // 画像表示モードかどうかで処理を変更
        if (this.cardImageEnabled) {
            if(this.baseType === 'transform'){
                html = `<img src="${this.getCardImageUrl()}" width="430" height="311">`;
            } else {
                html = `<img src="${this.getCardImageUrl()}" width="309" height="432">`;
            }

        } else {

            let cardTitleHtml = `<ruby><rb>${this.name}</rb><rp>(</rp><rt>${this.ruby}</rt><rp>)</rp></ruby>`
            html = `<div class='ui header' style='margin-right: 2em;'>${cardTitleHtml}`

            html += `</div><div class='ui content'>`
            if (this.baseType === 'special') {
                html += `<div class='ui top right attached label'>${t("消費", { lng: this.languageSetting.cardText })}: ${this.cost}</div>`;
            }

            let closedSymbol = t('[閉]', { lng: this.languageSetting.cardText });
            let openedSymbol = t('[開]', { lng: this.languageSetting.cardText });

            let typeCaptions = [];
            if (this.types.indexOf('attack') >= 0) typeCaptions.push(`<span class='card-type-attack'>${t('攻撃', { lng: this.languageSetting.cardText })}</span>`);
            if (this.types.indexOf('action') >= 0) typeCaptions.push(`<span class='card-type-action'>${t('行動', { lng: this.languageSetting.cardText })}</span>`);
            if (this.types.indexOf('enhance') >= 0) typeCaptions.push(`<span class='card-type-enhance'>${t('付与', { lng: this.languageSetting.cardText })}</span>`);
            if (this.types.indexOf('variable') >= 0) typeCaptions.push(`<span class='card-type-variable'>${t('不定', { lng: this.languageSetting.cardText })}</span>`);
            if (this.types.indexOf('reaction') >= 0) typeCaptions.push(`<span class='card-type-reaction'>${t('対応', { lng: this.languageSetting.cardText })}</span>`);
            if (this.types.indexOf('fullpower') >= 0) typeCaptions.push(`<span class='card-type-fullpower'>${t('全力', { lng: this.languageSetting.cardText })}</span>`);
            if (this.types.indexOf('transform') >= 0) typeCaptions.push(`<span class='card-type-transform'>Transform</span>`);
            html += `${typeCaptions.join('/')}`;
            if (this.range !== undefined) {
                if (this.rangeOpened !== undefined) {
                    html += `<span style='margin-left: 1em;'>${t('適正距離', { lng: this.languageSetting.cardText })} ${closedSymbol}${this.range} ${openedSymbol}${this.rangeOpened}</span>`
                } else {
                    html += `<span style='margin-left: 1em;'>${t('適正距離', { lng: this.languageSetting.cardText })}${this.range}</span>`;
                }
            }
            html += `<br>`;
            if (this.types.indexOf('enhance') >= 0) {
                html += `${t('カード説明-納N', { capacity: this.capacity, lng: this.languageSetting.cardText })}<br>`;
            }

            if (this.damageOpened !== undefined) {
                // 傘の開閉によって効果が分かれる攻撃カード
                html += `${closedSymbol} ${this.damage}<br>`;
                html += `${this.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
                html += (this.text ? '<br>' : '');
                html += `${openedSymbol} ${this.damageOpened}<br>`;
                html += `${this.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
            } else if (this.textOpened) {
                // 傘の開閉によって効果が分かれる非攻撃カード
                html += `${closedSymbol} ${this.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
                html += (this.text ? '<br>' : '');
                html += `${openedSymbol} ${this.textOpened.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;

            } else {
                if (this.damage !== undefined) {
                    html += `${this.damage}<br>`;
                }
                html += `${this.text.replace(/----\n/g, '<hr>').replace(/\n/g, '<br>')}`;
            }
            // 追加札で、かつ追加元が指定されている場合
            if (this.extra && this.extraFrom) {
                html += `<div class="extra-from">${t('追加 ≫ CARDNAME', { cardName: this.extraFromData.name, lng: this.languageSetting.cardText })}</div>`
            }
            html += `</div>`;

            if (this.megami === 'kururu') {
                // 歯車枠のスタイリング。言語によって処理を変える
                if (this.languageSetting.cardText === 'ja'){
                    html = html.replace(/<([攻行付対全]+)>/g, (str, arg) => {
                        let replaced = arg.replace(/攻+/, (str2) => `<span class='card-type-attack'>${str2}</span>`)
                            .replace(/行+/, (str2) => `<span class='card-type-action'>${str2}</span>`)
                            .replace(/付+/, (str2) => `<span class='card-type-enhance'>${str2}</span>`)
                            .replace(/対+/, (str2) => `<span class='card-type-reaction'>${str2}</span>`)
                            .replace(/全+/, (str2) => `<span class='card-type-fullpower'>${str2}</span>`)
                        return `<${replaced}>`;
                    });
                } else if (this.languageSetting.cardText === 'zh-Hans') {
                    html = html.replace(/机巧：([红蓝绿紫黄]+)+/g, (str, arg) => {
                        let replaced = arg.replace(/红+/, (str2) => `<span class='card-type-attack'>${str2}</span>`)
                            .replace(/蓝+/, (str2) => `<span class='card-type-action'>${str2}</span>`)
                            .replace(/绿+/, (str2) => `<span class='card-type-enhance'>${str2}</span>`)
                            .replace(/紫+/, (str2) => `<span class='card-type-reaction'>${str2}</span>`)
                            .replace(/黄+/, (str2) => `<span class='card-type-fullpower'>${str2}</span>`)
                        return `机巧：${replaced}`;
                    });
                } else if (this.languageSetting.cardText === 'en') {
                    html = html.replace(/Mechanism \((ATK|ACT|ENH|REA|THR| )+\)/g, (str, arg) => {
                        let replaced = arg.replace(/(?:ATK ?)+/, (str2) => `<span class='card-type-attack'>${str2}</span>`)
                            .replace(/(?:ACT ?)+/, (str2) => `<span class='card-type-action'>${str2}</span>`)
                            .replace(/(?:ENH ?)+/, (str2) => `<span class='card-type-enhance'>${str2}</span>`)
                            .replace(/(?:REA ?)+/, (str2) => `<span class='card-type-reaction'>${str2}</span>`)
                            .replace(/(?:THR ?)+/, (str2) => `<span class='card-type-fullpower'>${str2}</span>`)
                        return `Mechanism (${replaced})`;
                    });
                }
            }
        }

        return html;
    }
}

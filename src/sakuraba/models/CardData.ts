import * as _ from "lodash";
import { CardDataItem, CARD_DATA } from "sakuraba";

export class CardData {
    /** カードセット */
    cardSet: CardSet;

    /** 対象のカードID */
    cardId: string;

    /** 言語 */
    language: string;

    /** 複製元のカードID */
    duplicatingCardId: string | null = null;

    /** 傘が開いている場合の情報を使用するかどうか */
    usedOpenedCardData: boolean = false;

    constructor(cardSet: CardSet, cardId: string, language: string, duplicatingCardId?: string){
        this.cardSet = cardSet;
        this.cardId = cardId;
        this.language = language;
        if(duplicatingCardId){
            this.duplicatingCardId = duplicatingCardId;
        }
    }

    get baseData(): CardDataItem {
        return CARD_DATA[this.cardSet][this.cardId];
    }

    get duplicatingBaseData(): CardDataItem {
        return CARD_DATA[this.duplicatingCardId][this.cardId];
    }

    /** メガミ */
    get megami(): CardDataItem['megami'] {
        let data = (this.duplicatingCardId ? this.duplicatingBaseData : this.baseData);
        return data.megami;
    }
    /** カード名 */
    get name(): CardDataItem['name'] {
        return (this.language === 'en' ? this.baseData.nameEn : this.baseData.name);
    }
    /** 読み仮名 */
    get ruby(): CardDataItem['ruby'] {
        return (this.language === 'en' ? '' : this.baseData.ruby);
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
        return (this.language === 'en' ? this.baseData.textEn : this.baseData.text);
    }

    /** 説明テキスト */
    get textOpened(): CardDataItem['textOpened'] {
        return (this.language === 'en' ? this.baseData.textOpenedEn : this.baseData.textOpened);
    }

    /** 追加札かどうか(デッキ構築の時に選択できず、ゲーム開始時に追加札領域に置かれる) */
    get extra(): CardDataItem['extra'] {
        return this.extra;
    }
    /** 追加札の追加元 */
    get extraFrom(): CardDataItem['extraFrom'] {
        return this.baseData.exchangableTo;
    }
    /** 追加札の追加元データ */
    get extraFromBaseData(): CardDataItem {
        return CARD_DATA[this.cardSet][this.extraFrom];
    }

    /** 交換先 */
    get exchangableTo(): CardDataItem['exchangableTo'] {
        return this.baseData.exchangableTo;
    }

    /** 交換先データ */
    get exchangableToBaseData(): CardDataItem {
        return CARD_DATA[this.cardSet][this.exchangableTo];
    }


}

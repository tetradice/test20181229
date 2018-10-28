import * as _ from "lodash";
import { CardDataItem, CARD_DATA } from "sakuraba";

export class CardData {
    /** 対象のカードID */
    cardId: string;

    /** 複製元のカードID */
    duplicatingCardId: string | null = null;

    /** 傘が開いている場合の情報を使用するかどうか */
    usedOpenedCardData: boolean = false;

    constructor(cardId: string, duplicatingCardId?: string){
        this.cardId = cardId;
        if(duplicatingCardId){
            this.duplicatingCardId = duplicatingCardId;
        }
    }

    /** メガミ */
    get megami(): CardDataItem['megami'] {
        let data = (this.duplicatingCardId ? CARD_DATA[this.duplicatingCardId] : CARD_DATA[this.cardId]);
        return data.megami;
    }
    /** カード名 */
    get name(): CardDataItem['name'] {
        return CARD_DATA[this.cardId].name;
    }
    /** 読み仮名 */
    get ruby(): CardDataItem['ruby'] {
        return CARD_DATA[this.cardId].ruby;
    }
    /** 分類 (通常/切札/Transform) */
    get baseType(): CardDataItem['baseType'] {
        return CARD_DATA[this.cardId].baseType;
    }
    /** タイプ */
    get types(): CardDataItem['types'] {
        let data = (this.duplicatingCardId ? CARD_DATA[this.duplicatingCardId] : CARD_DATA[this.cardId]);
        return data.types;
    }
    /** 消費 */
    get cost(): CardDataItem['cost'] {
        let data = (this.duplicatingCardId ? CARD_DATA[this.duplicatingCardId] : CARD_DATA[this.cardId]);
        return data.cost;
    }

    /** 適正距離 */
    get range(): CardDataItem['range'] {
        let data = (this.duplicatingCardId ? CARD_DATA[this.duplicatingCardId] : CARD_DATA[this.cardId]);
        if(this.usedOpenedCardData){
            return data.rangeOpened;
        } else {
            return data.range;
        }
    }

    /** 納 */
    get capacity(): CardDataItem['capacity'] {
        let data = (this.duplicatingCardId ? CARD_DATA[this.duplicatingCardId] : CARD_DATA[this.cardId]);
        return data.capacity;
    }

    /** ダメージ */
    get damage(): CardDataItem['damage'] {
        let data = (this.duplicatingCardId ? CARD_DATA[this.duplicatingCardId] : CARD_DATA[this.cardId]);
        if(this.usedOpenedCardData){
            return data.damageOpened;
        } else {
            return data.damage;
        }
    }

    /** 毒フラグ */
    get poison(): CardDataItem['poison'] {
        return CARD_DATA[this.cardId].poison; // でゅーぷりぎあに毒を複製した場合でも毒扱いにはならない
    }

    /** 説明テキスト */
    get text(): CardDataItem['text'] {
        return CARD_DATA[this.cardId].text;
    }
}

import * as sakuraba from "sakuraba";
import * as models from "sakuraba/models";
import { t } from "i18next";

/** カードセット名取得 */
export function getCardSetName(cardSet: CardSet): string{
    return t(cardSet === 'na-s3' ? t('cardset:新幕 シーズン3') : t('cardset:新幕 シーズン2'))
}

/** カードセットの説明を取得 (選択時に表示) */
export function getCardSetDescription(cardSet: CardSet): string {
    return t(cardSet === 'na-s3' ? t('cardset:新幕 シーズン3-説明') : t('cardset:新幕 シーズン2-説明'))
}


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
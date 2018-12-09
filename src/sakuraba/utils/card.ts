import { Megami, CARD_DATA, MEGAMI_DATA, CardDataItem, ALL_CARD_LIST, ALL_CARD_ID_LIST } from "sakuraba";

// 指定したメガミのカードIDリストを取得
export function getMegamiCardIds(megami: Megami, cardSet: CardSet, baseType: null | CardDataItem['baseType'], includeExtra = false){
    let ret = [];

    // 全カードを探索し、指定されたメガミと対応するカードを、カードIDリストへ追加する
    for (let key of ALL_CARD_ID_LIST[cardSet]) {
        let data = CARD_DATA[cardSet][key];
        let megamiData = MEGAMI_DATA[megami];

        let replacedByAnother = ALL_CARD_LIST[cardSet].find(x => x.anotherID !== undefined && x.replace === key);

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

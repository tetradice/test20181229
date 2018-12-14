import * as sakuraba from "sakuraba";


/** メガミの表示名を取得（象徴武器表示あり） */
export function getMegamiDispNameWithSymbol(lang: string, megami: sakuraba.Megami): string {
    let data = sakuraba.MEGAMI_DATA[megami];

    if (lang === 'zh') {
        return `${data.nameZh}(${data.symbolZh})`
    } else if (lang === 'en') {
        return `${data.nameEn} (${data.symbolEn})`
    } else {
        return `${data.name}(${data.symbol})`
    }
}

/** メガミの表示名を取得 */
export function getMegamiDispName(lang: string, megami: sakuraba.Megami): string {
    let data = sakuraba.MEGAMI_DATA[megami];

    if (lang === 'zh') {
        return `${data.nameZh}`
    } else if (lang === 'en') {
        return `${data.nameEn}`
    } else {
        return `${data.name}`
    }
}
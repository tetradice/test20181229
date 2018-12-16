import * as models from "sakuraba/models";
import i18next = require("i18next");
import { getMegamiDispName } from "./megamiData";
import { t } from "i18next";
import { getCardSetName } from "./cardData";

/** ログを表示できるかどうか判定 */
export function logIsVisible(log: state.LogRecord, side: SheetSide): boolean {
    if (log.visibility === 'shown') return true;
    if (log.visibility === 'ownerOnly' && log.side === side) return true;
    if (log.visibility === 'outerOnly' && log.side !== side) return true;
    return false;
}

// パラメータとして渡されたログ値を、保存用の形式に変換する
export function convertLogValueForState(val: LogValue): state.ActionLogBody {
    let params: { [key: string]: state.ActionLogBody } = {};
    if (val[1] !== null) {
        for (let paramName in val[1]) {
            params[paramName] = convertLogParamValueForState(val[1][paramName]);
        }
    }

    return { type: 'ls', key: val[0], params: params };
}

function convertLogParamValueForState(val: LogParamValue): state.ActionLogBody {
    if (typeof val === 'number') {
        return val.toString();
    } else if (typeof val === 'string') {
        return val;
    } else if (Array.isArray(val)) {
        return convertLogValueForState(val);
    } else {
        return val;
    }
}

/**
 * ログオブジェクトを翻訳する (パラメータの中に翻訳対象オブジェクトが含まれていれば再帰的に翻訳)
 */
export function translateLog(log: state.ActionLogBody, languageSetting: LanguageSetting): string {
    if (!log) return "";

    let buf = "";
    if (Array.isArray(log)) {
        // 配列が渡された場合、全要素を翻訳して結合
        return log.map(x => translateLog(x, languageSetting)).join('');

    } else {
        // 固定文字列
        if (typeof log === 'string') {
            return log;
        }
        // 数値 (文字列に変換)
        if (typeof log === 'number') {
            return log.toString();
        }
        // 翻訳対象文字列
        if (log.type === 'ls') {

            let params = {};
            for (let k in log.params) {
                params[k] = translateLog(log.params[k], languageSetting); // パラメータも再帰的に翻訳する
            }

            // i18nextで翻訳した結果を返す
            return t(log.key, params);
        }

        // カード名
        if (log.type === 'cn') {
            let cardData = new models.CardData(log.cardSet, log.cardId, languageSetting);
            return cardData.name;
        }

        // カードセット名
        if (log.type === 'cs') {
            return getCardSetName(log.cardSet);
        }

        // メガミ名
        if (log.type === 'mn') {
            // i18nextから現在の言語を取得
            return getMegamiDispName(i18next.language, log.megami);
        }
    }

    return undefined;
}


/** カードの領域名をログ出力形式で取得 */
export function getCardRegionTitleLog(
    selfSide: PlayerSide
    , side: PlayerSide
    , region: CardRegion
    , cardSet: CardSet
    , linkedCard: state.Card
): state.ActionLogItem[]
{
    let ret: state.ActionLogItem[] = [];

    // 相手側に移動する場合は「相手の」を付加
    if (selfSide !== side) {
        ret.push({type: 'ls', key: '領域名-相手の'});
    }

    // 領域名ログを返す
    if (region === 'hand') {
        ret.push({type: 'ls', key: "領域名-手札"});
    }
    if (region === 'hidden-used') {
        ret.push({ type: 'ls', key: "領域名-伏せ札"});
    }
    if (region === 'library') {
        ret.push({type: 'ls', key: "領域名-山札"});
    }
    if (region === 'special') {
        ret.push({type: 'ls', key: "領域名-切札"});
    }
    if (region === 'used') {
        ret.push({type: 'ls', key: "領域名-使用済み"});
    }
    if (region === 'extra') {
        ret.push({type: 'ls', key: "領域名-追加札"});
    }
    if (region === 'on-card') {
        ret.push({type: 'ls', key: '領域名-[CARDNAME]の下', params: {cardName: {type: 'cn', cardSet: cardSet, cardId: linkedCard.cardId}}});
    }

    return ret;
}

/** 桜花結晶のリージョン名を取得 */
export function getSakuraTokenRegionTitleLog(
    selfSide: PlayerSide
    , side: PlayerSide
    , region: SakuraTokenRegion
    , cardSet: CardSet
    , linkedCard: state.Card
): state.ActionLogItem[]
{
    let ret: state.ActionLogItem[] = [];

    // 相手側に移動する場合は「相手の」を付加
    if (selfSide !== side) {
        ret.push({ type: 'ls', key: '領域名-相手の' });
    }

    // 領域名ログを返す
    if (region === 'aura') {
        ret.push({ type: 'ls', key: "領域名-オーラ" });
    }
    if (region === 'life') {
        ret.push({ type: 'ls', key: "領域名-ライフ" });
    }
    if (region === 'flair') {
        ret.push({ type: 'ls', key: "領域名-フレア" });
    }
    if (region === 'distance') {
        ret.push({ type: 'ls', key: "領域名-間合" });
    }
    if (region === 'dust') {
        ret.push({ type: 'ls', key: "領域名-ダスト" });
    }
    if (region === 'machine') {
        ret.push({ type: 'ls', key: "領域名-マシン" });
    }
    if (region === 'burned') {
        ret.push({ type: 'ls', key: "領域名-燃焼済" });
    }
    if (region === 'out-of-game') {
        ret.push({ type: 'ls', key: "領域名-ゲーム外" });
    }
    if (region === 'on-card') {
        ret.push({ type: 'ls', key: '領域名-[CARDNAME]上', params: { cardName: { type: 'cn', cardSet: cardSet, cardId: linkedCard.cardId } } });
    }

    return ret;
}

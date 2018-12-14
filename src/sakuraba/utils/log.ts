import * as sakuraba from "sakuraba";
import * as models from "sakuraba/models";
import i18next = require("i18next");

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
export function translateLog(log: state.ActionLogBody): string {
    if (!log) return "";

    let buf = "";
    if (Array.isArray(log)) {
        // 配列が渡された場合、全要素を翻訳して結合
        return log.map(x => translateLog(x)).join('');

    } else {
        // 固定文字列
        if (typeof log === 'string') {
            return log;
        }

        // 翻訳対象文字列
        if (log.type === 'ls') {

            let params = {};
            for (let k in log.params) {
                params[k] = translateLog(log.params[k]); // パラメータも再帰的に翻訳する
            }

            // i18nextで翻訳した結果を返す
            return t(log.key, params);
        }

        // カード名
        if (log.type === 'cn') {
            let cardData = new models.CardData(log.cardSet, log.cardId, 'ja');
            return cardData.name;
        }

        // カードセット名
        if (log.type === 'cs') {
            return sakuraba.CARD_SET_NAMES[log.cardSet];
        }

        // メガミ名
        if (log.type === 'mn') {
            // i18nextから現在の言語を取得
            return getMegamiDispName(i18next.language, log.megami);
        }
    }

    return undefined;
}
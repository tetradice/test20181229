import _ from "lodash";
import i18next = require("i18next");
import * as utils from "sakuraba/utils";

export default {
    /** 設定を上書き */
    setSetting: (newSetting: state.VersionUnspecifiedSetting) => (state: state.State) => {
        // バージョンで判定
        if(newSetting['settingDataVersion'] === undefined){
            // バージョン1 -> 2へのマイグレーション
            // 初期設定で上書きする
            let refState = utils.createInitialState();
            (newSetting as state.Setting).language = refState.setting.language;
            (newSetting as state.Setting).cardImageEnabledTestEn = refState.setting.cardImageEnabledTestEn;
            (newSetting as state.Setting).settingDataVersion = 2;
        }

        return {setting: newSetting} as Partial<state.State>;
    },

    /** メガミ表示を変更する */
    setMegamiFaceSetting: (value: 'background1' | 'none') => (state: state.State) => {
        let newSetting = _.assign({}, state.setting);
        newSetting.megamiFaceViewMode = value;
        return {setting: newSetting} as Partial<state.State>;
    },

    /** カード画像表示ON/OFFを設定する */
    setCardImageEnabled: (value: boolean) => (state: state.State) => {
        let newSetting = _.assign({}, state.setting);
        newSetting.cardImageEnabledTestEn = value;
        return { setting: newSetting } as Partial<state.State>;
    },
}
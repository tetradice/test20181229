import _ from "lodash";
import i18next = require("i18next");
import { settings } from "cluster";
import { createInitialState } from "sakuraba/utils";

export default {
    /** 設定を上書き */
    setSetting: (newSetting: state.Setting) => (state: state.State) => {
        // 言語設定がなければ、現在の設定で上書きする
        if(newSetting.language === undefined){
            newSetting.language = state.setting.language;
        }

        return {setting: newSetting} as Partial<state.State>;
    },

    /** メガミ表示を変更する */
    setMegamiFaceSetting: (value: 'background1' | 'none') => (state: state.State) => {
        let newSetting = _.assign({}, state.setting);
        newSetting.megamiFaceViewMode = value;
        return {setting: newSetting} as Partial<state.State>;
    }
}
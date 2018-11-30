import _ from "lodash";
import i18next = require("i18next");

export default {
    /** 設定を上書き */
    setSetting: (newSetting: state.Setting) => {
        return {setting: newSetting} as Partial<state.State>;
    },

    /** メガミ表示を変更する */
    setMegamiFaceSetting: (value: 'background1' | 'none') => (state: state.State) => {
        let newSetting = _.assign({}, state.setting);
        newSetting.megamiFaceViewMode = value;
        return {setting: newSetting} as Partial<state.State>;
    },

    /** 言語を変更する */
    setLanguageSetting: (value: state.LanguageSetting) => (state: state.State) => {
        let newSetting = _.assign({}, state.setting);
        newSetting.language = value;

        i18next.changeLanguage(value);

        return {setting: newSetting} as Partial<state.State>;
    }
}
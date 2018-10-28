import _ from "lodash";

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
    }

}
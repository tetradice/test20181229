import moment = require('moment');
import * as models from "sakuraba/models";

export default {
    toggleActionLogVisible: () => (state: state.State) => {
        return {actionLogVisible: !state.actionLogVisible};
    },

    appendActionLog: (p: {text: string}) => (state: state.State) => {
        let append: state.LogRecord = {body: p.text, time: moment().format(), playerSide: state.side};
        let newLogs = state.actionLog.concat([append]);
        
        return {actionLog: newLogs};
    }
}
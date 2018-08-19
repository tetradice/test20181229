import moment = require('moment');
import * as models from "sakuraba/models";

export default {
    toggleActionLogVisible: () => (state: state.State) => {
        return {actionLogVisible: !state.actionLogVisible};
    },

    appendActionLog: (p: {text: string, hidden?: boolean}) => (state: state.State) => {
        let append: state.LogRecord = {body: p.text, time: moment().format(), playerSide: state.side, hidden: p.hidden};
        let newLogs = state.actionLog.concat([append]);
        
        return {actionLog: newLogs};
    },

    appendReceivedActionLogs: (logs: state.LogRecord[]) => (state: state.State) => {
        return {actionLog: state.actionLog.concat(logs)};
    },

    setActionLogs: (newLogs: state.LogRecord[]) => (state: state.State) => {
        return {actionLog: newLogs};
    }
}
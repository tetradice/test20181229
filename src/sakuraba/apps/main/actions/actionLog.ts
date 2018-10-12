import moment = require('moment');


export default {
    toggleActionLogVisible: () => (state: state.State) => {
        return {actionLogVisible: !state.actionLogVisible};
    },

    appendActionLog: (p: {text: string, visibility?: LogVisibility}) => (state: state.State) => {
        let append: state.LogRecord = {
              body: p.text
            , time: moment().format()
            , side: state.side
            , watcherSessionId: (state.side === 'watcher' ? state.currentWatcherSessionId : null)
            , visibility: (p.visibility ? p.visibility : 'shown')
        };
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
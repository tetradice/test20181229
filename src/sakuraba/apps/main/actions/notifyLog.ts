import moment = require('moment');


export default {
    appendNotifyLog: (p: { text: string }) => (state: state.State) => {
        let append: state.NotifyLogRecord = {
              no: null // DBへの保存時に採番
            , type: 'n'
            , body: p.text
            , time: moment().format()
            , side: state.side
            , watcherSessionId: (state.side === 'watcher' ? state.currentWatcherSessionId : null)
            , visibility: 'shown'
        };
        let newLogs = state.notifyLog.concat([append]);

        return { notifyLog: newLogs };
    },

    appendReceivedNotifyLogs: (logs: state.NotifyLogRecord[]) => (state: state.State) => {
        return { notifyLog: state.notifyLog.concat(logs) };
    },

    setNotifyLogs: (newLogs: state.NotifyLogRecord[]) => (state: state.State) => {
        return { notifyLog: newLogs };
    }
}
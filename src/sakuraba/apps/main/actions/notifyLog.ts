import moment = require('moment');


export default {
    appendNotifyLog: (p: { text: string }) => (state: state.State) => {
        if(state.side === 'watcher') throw "Forbidden operation for watcher"; // 観戦者は呼び出し不可能な操作

        let append: state.NotifyLogRecord = {
              no: null // DBへの保存時に採番
            , type: 'n'
            , body: p.text
            , time: moment().format()
            , side: state.side
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
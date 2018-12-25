import moment = require('moment');


export default {
    appendChatLog: (p: { text: string }) => (state: state.State) => {
        let append: state.ChatLogRecord = {
              no: null // DBへの保存時に採番
            , type: 'c'
            , body: p.text
            , time: moment().format()
            , side: state.side
            , watcherSessionId: (state.side === 'watcher' ? state.currentWatcherSessionId : null)
            , visibility: 'shown'
        };
        let newLogs = state.chatLog.concat([append]);

        return { chatLog: newLogs };
    },

    appendReceivedChatLogs: (logs: state.ChatLogRecord[]) => (state: state.State) => {
        return { chatLog: state.chatLog.concat(logs) };
    },

    setChatLogs: (newLogs: state.ChatLogRecord[]) => (state: state.State) => {
        return { chatLog: newLogs };
    }
}
import moment = require('moment');


export default {
    appendChatLog: (p: {text: string}) => (state: state.State) => {
        let append: state.LogRecord = {body: p.text, time: moment().format(), playerSide: state.side, visibility: 'shown'};
        let newLogs = state.chatLog.concat([append]);
        
        return {chatLog: newLogs};
    },

    appendReceivedChatLogs: (logs: state.LogRecord[]) => (state: state.State) => {
        return {chatLog: state.chatLog.concat(logs)};
    },

    setChatLogs: (newLogs: state.LogRecord[]) => (state: state.State) => {
        return {chatLog: newLogs};
    }
}
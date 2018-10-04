import moment = require('moment');
import * as models from "sakuraba/models";


export default {
    toggleActionLogVisible: () => (state: state.State) => {
        return {actionLogVisible: !state.actionLogVisible};
    },

    appendActionLog: (p: {text: string, visibility?: LogVisibility}) => (state: state.State) => {
        let append: state.LogRecord = {body: p.text, time: moment().format(), playerSide: state.side, visibility: (p.visibility ? p.visibility : 'shown')};
        let newLogs = state.actionLog.concat([append]);
        
        return {actionLog: newLogs};
    },

    appendReceivedActionLogs: (logs: state.LogRecord[]) => (state: state.State) => {
        return {actionLog: state.actionLog.concat(logs)};
    },

    setActionLogs: (newLogs: state.LogRecord[]) => (state: state.State) => {
        return {actionLog: newLogs};
    }

    
    
    // appendChatLog: (p: {text: string}) => (state: state.State) => {
    //     let append: state.LogRecord = {body: p.text, time: moment().format(), playerSide: state.side, visibility: 'shown'};
    //     let newLogs = state.chatLog.concat([append]);
        
    //     return {chatLog: newLogs};
    // },

    // appendReceivedChatLogs: (logs: state.LogRecord[]) => (state: state.State) => {
    //     return {chatLog: state.chatLog.concat(logs)};
    // },

    // setChatLogs: (newLogs: state.LogRecord[]) => (state: state.State) => {
    //     return {chatLog: newLogs};
    // }
}
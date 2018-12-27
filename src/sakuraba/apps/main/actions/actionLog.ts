import moment = require('moment');
import * as utils from "sakuraba/utils";


export default {
    toggleActionLogVisible: () => (state: state.State) => {
        return {actionLogVisible: !state.actionLogVisible};
    },

    appendActionLog: (p: {text?: LogValue, body?: state.ActionLogBody, visibility?: LogVisibility, indent?: boolean}) => (state: state.State) => {
        // textとbodyを両方指定することはできない
        if(p.text !== undefined && p.body !== undefined) throw "ArgumentError - appendActionLog - text and body are both specified";

        // 渡された引数を保存用に変換
        let logBody: state.ActionLogBody;
        if(p.body !== undefined){
            logBody = p.body;
        } else {
            logBody = utils.convertLogValueForState(p.text);
        }

        // 保存
        let append: state.ActionLogRecord = {
              no: null // DBへの保存時に採番
            , type: 'a'
            , body: logBody
            , time: moment().format()
            , side: state.side
            , watcherSessionId: (state.side === 'watcher' ? state.currentWatcherSessionId : undefined)
            , watcherName: (state.side === 'watcher' && state.board.watchers[state.currentWatcherSessionId] ? state.board.watchers[state.currentWatcherSessionId].name : undefined)
            , visibility: (p.visibility ? p.visibility : 'shown')
            , indent: p.indent
        };
        let newLogs = state.actionLog.concat([append]);
        
        return {actionLog: newLogs};
    },

    appendReceivedActionLogs: (logs: state.ActionLogRecord[]) => (state: state.State) => {
        return {actionLog: state.actionLog.concat(logs)};
    },

    setActionLogs: (newLogs: state.ActionLogRecord[]) => (state: state.State) => {
        return {actionLog: newLogs};
    }
}
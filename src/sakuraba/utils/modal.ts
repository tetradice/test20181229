import { nl2br, nl2brJsx } from "./misc";
import _ from "lodash";
import { commonConfirmModal } from "sakuraba/apps";

export function confirmModal(desc: string, yesCallback: () => void){
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');

    let initState = commonConfirmModal.State.create(nl2brJsx(desc), yesCallback, null);
    commonConfirmModal.run(initState, document.getElementById('CONFIRM-MODAL-PLACEHOLDER'))
}

/** メッセージを表示する */
export function messageModal(desc: string){
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');

    $('#MESSAGE-MODAL .description').html(nl2br(desc));
    $('#MESSAGE-MODAL')
        .modal({closable: false})
        .modal('show');
}

/** 任意のモーダルを表示する */
export function showModal(modalSelector: string){
    $(modalSelector)
        .modal({closable: false})
        .modal('show');
}

/** 入力ボックスを表示する */
export function userInputModal(desc: string, decideCallback: (this: JQuery, $element: JQuery) => false | void){
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');

    $('#INPUT-MODAL .description-body').html(nl2br(desc));
    $('#INPUT-MODAL')
        .modal({closable: false, onApprove:decideCallback})
        .modal('show');
}

/** V1のアクションログを最新の形式へコンバート */
export function convertV1ActionLogs(v1Logs: state_v1.LogRecord[], startingNo: number, watchers: {[sessionId: string]: state_v1.WatcherInfo}): state.ActionLogRecord[]{
    let newLogs: state.ActionLogRecord[] = [];
    let currentNo = startingNo;
    for(let v1Log of v1Logs){
        let newLog: state.ActionLogRecord = {
              no: currentNo
            , type: 'a'
            , body: v1Log.body
            , visibility: v1Log.visibility
            , time: v1Log.time
            , side: v1Log.side
        };
        if (v1Log.side === 'watcher') {
            newLog.watcherSessionId = v1Log.watcherSessionId;
            newLog.watcherName = (watchers[v1Log.watcherSessionId] ? watchers[v1Log.watcherSessionId].name : '?');
        }
        newLogs.push(newLog);
        currentNo++;
    }

    return newLogs;
}

/** V1のチャットログを最新の形式へコンバート */
export function convertV1ChatLogs(v1Logs: state_v1.LogRecord[], startingNo: number, watchers: {[sessionId: string]: state_v1.WatcherInfo}): state.ChatLogRecord[] {
    let newLogs: state.ChatLogRecord[] = [];
    let currentNo = startingNo;
    for (let v1Log of v1Logs) {
        let newLog: state.ChatLogRecord = {
            no: currentNo
            , type: 'c'
            , body: v1Log.body
            , visibility: v1Log.visibility
            , time: v1Log.time
            , side: v1Log.side
        };
        if(v1Log.side === 'watcher'){
            newLog.watcherSessionId = v1Log.watcherSessionId;
            newLog.watcherName = (watchers[v1Log.watcherSessionId] ? watchers[v1Log.watcherSessionId].name : '?');
        }
        newLogs.push(newLog);
        currentNo++;
    }

    return newLogs;
}
import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";
import { BOARD_BASE_WIDTH } from "sakuraba/const";
import { t } from "i18next";

/** チャット */
export const ChatLogArea = (p: {logs: state.ChatLogRecord[]}) => (state: state.State, actions: ActionsType) => {

    let logElements: Children[] = [];
    let now = moment();
    p.logs.forEach((log) => {
        // 表示対象外の場合はスキップ
        if(!utils.logIsVisible(log, state.side)) return;

        // 今日のログか昨日以前のログかで形式を変更
        let logTime = moment(log.time);
        let timeStr = (logTime.isSame(now, 'date') ? logTime.format('H:mm') : logTime.format('YYYY/M/D H:mm'));
        let bodyStyle = (log.visibility === 'ownerOnly' ? {color: 'green'} : null);
        let name = (log.side === 'watcher' ? (state.board.watchers[log.watcherSessionId] ? state.board.watchers[log.watcherSessionId].name : '?') : state.board.playerNames[log.side]);
        logElements.push(
            <div>
            {name}: <span style={bodyStyle}>{log.body}</span> <span style={{fontSize: 'smaller', color: 'silver'}}>({timeStr})</span>
            </div>
        )
    });

    const oncreate = (target) => {
        // スクロールバーを最下部までスクロール
        let $logArea = $(target).find('#CHAT-LOG-AREA');
        $logArea.scrollTop($logArea.get(0).scrollHeight);

        // Enterを押下した場合、ボタンを押下したものと扱う
        $(target).keydown(function(e){
            if(e.key === 'Enter'){
                $(target).find('button').click();
            }
        });
    };

    const onupdate = (target) => {
        // スクロールバーを最下部までスクロール
        let $logArea = $(target).find('#CHAT-LOG-AREA');
        $logArea.scrollTop($logArea.get(0).scrollHeight);
    };

    const onSend = (e: MouseEvent) => {
        let $text = $(e.target).closest('.ui.input').find('input[type=text]');
        let log = {text: $text.val() as string};
        let newChatLogs = actions.appendChatLog(log);
        $text.val('');

        // ソケットにチャットログの更新を通知
        if(state.socket){
            state.socket.emit('appendChatLog', { tableId: state.tableId, appendedChatLog: newChatLogs.chatLog[newChatLogs.chatLog.length - 1]});
        }
    };

    return (
        <div id="CHAT-LOG-SEGMENT"  style={{left: `${BOARD_BASE_WIDTH * state.zoom + 10}px`}}
            class="ui segment"
            oncreate={oncreate}
            onupdate={onupdate}>
            <div class="ui top attached label">{t('チャット')}</div>
            <div id="CHAT-LOG-AREA">{logElements}</div>
            <div id="CHAT-INPUT-AREA">
                <div class="ui action fluid input">
                    <input type="text" />
                    <button class="ui button" onclick={onSend}>{t('送信')}</button>
                </div>
            </div>
        </div>
    );
}
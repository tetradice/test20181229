import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top'), width: $(elem).css('width'), height: $(elem).css('height')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** 操作ログ */
export const ActionLogWindow = (p: {shown: boolean, logs: state.LogRecord[]}) => (state: state.State, actions: ActionsType) => {
    if(p.shown){
        let logElements: Children[] = [];
        let now = moment();
        p.logs.forEach((log) => {
            // 相手サイドの隠しログは表示しない
            if(log.hidden && log.playerSide !== state.side) return;

            // 今日のログか昨日以前のログかで形式を変更
            let logTime = moment(log.time);
            let timeStr = (logTime.isSame(now, 'date') ? logTime.format('h:mm') : logTime.format('YYYY/M/D h:mm'));
            let bodyStyle = (log.hidden ? {color: 'green'} : null);
            logElements.push(
                <div>
                {state.board.playerNames[log.playerSide]}: <span style={bodyStyle}>{log.body}</span> <span style={{fontSize: 'smaller', color: 'silver'}}>({timeStr})</span>
                </div>
            )
        });

        const oncreate = (e) => {
            // 一部ウインドウをリサイズ可能にする
            $(e).draggable({
                cursor: "move", 
                stop: function(){
                    saveWindowState(e);
                },
            });
            $(e).resizable({
                minWidth: 200,
                minHeight: 200,
                stop: function(){
                    saveWindowState(e);
                },
            });

            // ウインドウの状態を復元
            let actionLogWindowStateJson = localStorage.getItem(`${e.id}-WindowState`);
            if(actionLogWindowStateJson){
                let windowState = JSON.parse(actionLogWindowStateJson);
                $(e).css(windowState);
            }    
        }

        return (
            <div id="ACTION-LOG-WINDOW"
             style={{height: "500px", backgroundColor: "rgba(255, 255, 255, 0.9)"}}
              class="ui segment draggable ui-widget-content resizable"
              oncreate={oncreate}>
                <div class="ui top attached label">操作ログ<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleActionLogVisible()}><i class="times icon"></i></a></div>
                <div id="ACTION-LOG-AREA">{logElements}</div>
            </div>
        )
    } else {
        return null;
    }
}
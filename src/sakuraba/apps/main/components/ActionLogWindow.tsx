import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";
import { ZIndex } from "sakuraba/const";
import { t } from "i18next";

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top'), width: $(elem).css('width'), height: $(elem).css('height')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** 操作ログ */
export const ActionLogWindow = (p: {shown: boolean, logs: state.ActionLogRecord[]}) => (state: state.State, actions: ActionsType) => {
    if(p.shown){
        let logElements: Children[] = [];
        let now = moment();
        p.logs.forEach((log) => {
            // 表示対象外の場合はスキップ
            if(!utils.logIsVisible(log, state.side)) return;

            // 今日のログか昨日以前のログかで形式を変更
            let logTime = moment(log.time);
            let timeStr = (logTime.isSame(now, 'date') ? logTime.format('H:mm') : logTime.format('YYYY/M/D H:mm'));
            let bodyStyle = (log.visibility === 'ownerOnly' ? {color: 'green'} : null);
            let name = (log.side === 'watcher' ? (log.watcherName || '?') : state.board.playerNames[log.side]);

            logElements.push(
                <div>
                {name}: <span style={bodyStyle}>{utils.translateLog(log.body, state.setting.language)}</span> <span style={{fontSize: 'smaller', color: 'silver'}}>({timeStr})</span>
                </div>
            )
        });

        const oncreate = (e) => {
            // 一部ウインドウをリサイズ可能にする
            $(e).draggable({
                cursor: "move", 
                opacity: 0.7,
                cancel: "#ACTION-LOG-AREA",
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
            } else {
                // 設定がなければ中央に配置
                $(e).css({left: window.innerWidth / 2 - $(e).outerWidth() / 2, top: window.innerHeight / 2 - $(e).outerHeight() / 2});
            }

            // スクロールバーを最下部までスクロール
            let $logArea = $(e).find('#ACTION-LOG-AREA');
            $logArea.scrollTop($logArea.get(0).scrollHeight);
        };

        const onupdate = (e) => {
            // スクロールバーを最下部までスクロール
            let $logArea = $(e).find('#ACTION-LOG-AREA');
            $logArea.scrollTop($logArea.get(0).scrollHeight);
        };

        return (
            <div id="ACTION-LOG-WINDOW"
             style={{position: 'absolute', height: "500px", backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: ZIndex.FLOAT_WINDOW}}
              class="ui segment draggable ui-widget-content resizable"
              oncreate={oncreate}
              onupdate={onupdate}>
                <div class="ui top attached label">{t('操作ログ')}<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleActionLogVisible()}><i class="times icon"></i></a></div>
                <div id="ACTION-LOG-AREA">{logElements}</div>
            </div>
        )
    } else {
        return null;
    }
}
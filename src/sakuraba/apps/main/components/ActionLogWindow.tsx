import { h, Children } from "hyperapp";
import * as utils from "sakuraba/utils";

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top'), width: $(elem).css('width'), height: $(elem).css('height')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** 操作ログ */
export const ActionLogWindow = (p: {shown: boolean, logs: state.LogRecord[]}) => {
    if(p.shown){
        let logElements: Children[] = [];
        p.logs.forEach((log) => {
            logElements.push(<div>{log.body}</div>)
        });

        const oncreate = (e) => {
            // 一部ウインドウをリサイズ可能にする
            $(e).draggable({
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
             style={{height: "500px"}}
              class="ui segment draggable ui-widget-content resizable"
              oncreate={oncreate}>
                <div class="ui top attached label">ログ</div>
                <div id="ACTION-LOG-AREA">{logElements}</div>
            </div>
        )
    } else {
        return null;
    }
}
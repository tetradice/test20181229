import { h, Children } from "hyperapp";
import * as utils from "sakuraba/utils";

/** 操作ログ */
export const ActionLogWindow = (p: {shown: boolean, logs: state.LogRecord[]}) => {
    if(p.shown){
        let logElements: Children[] = [];
        p.logs.forEach((log) => {
            logElements.push(<div>{log.body}</div>)
        });

        return (
            <div id="ACTION-LOG-WINDOW" style={{height: "500px"}} class="ui segment draggable ui-widget-content resizable">
                <div class="ui top attached label">ログ</div>
                <div id="ACTION-LOG-AREA">{logElements}</div>
            </div>
        )
    } else {
        return null;
    }
}
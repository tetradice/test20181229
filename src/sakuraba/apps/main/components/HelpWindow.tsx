import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** ヘルプウインドウ */
export const HelpWindow = (p: {shown: boolean}) => (state: state.State, actions: ActionsType) => {
    if(p.shown){
        const oncreate = (e) => {
            // ウインドウを移動可能にする
            $(e).draggable({
                cursor: "move", 
                stop: function(){
                    saveWindowState(e);
                },
            });

            // ウインドウの状態を復元
            let windowStateJson = localStorage.getItem(`${e.id}-WindowState`);
            if(windowStateJson){
                let windowState = JSON.parse(windowStateJson);
                $(e).css(windowState);
            }
        };

        let contentDiv: JSX.Element;
        if(state.side === 'watcher'){
        } else if(!state.board.mariganFlags[state.side]){
            contentDiv = (
                <div>
                    <h4><i class="icon question circle outline"></i>決闘準備中の操作方法</h4>
                    <p>ボード上に表示されたボタンを押して、準備を進めてください。<br />
                    メガミ選択、デッキ構築、手札の引き直しが終わると決闘開始となります。</p>
                </div>
            );
        } else {
            contentDiv = (
                <div>
                    <h4><i class="icon question circle outline"></i>決闘中の操作方法</h4>
                    <p><strong>カード/桜花結晶をドラッグ:</strong> 移動<br />
                        <strong>山札をダブルクリック:</strong> カードを1枚引く<br />
                        <strong>切札をダブルクリック:</strong> 切札を表向き(使用済み)にする
                </p>
                    <ul>
                        <li>再構成を行うときは、自分の山札の上で右クリック</li>
                        <li>萎縮させるときは、集中力の上で右クリック</li>
                        <li>手札を相手に公開するときは、手札の上で右クリック</li>
                        <li>カードを封印したい時には、封印先のカードの上にドラッグ<br />（[論破]などの一部カードにのみ封印可能）</li>
                        <li>カードをゲームから取り除きたい場合は、そのカードの上で右クリック<br />（[風魔招来孔]などの一部カードのみ実行可能）</li>
                    </ul>
                </div>
            );
        }

        return (
            <div id="HELP-WINDOW"
             style={{position: 'absolute', height: "23rem", width: "40rem", backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 500}}
              class="ui segment draggable ui-widget-content resizable"
              oncreate={oncreate}>
                <div class="ui top attached label">操作説明<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleHelpVisible()}><i class="times icon"></i></a></div>
                {contentDiv}
            </div>
        )
    } else {
        return null;
    }
}
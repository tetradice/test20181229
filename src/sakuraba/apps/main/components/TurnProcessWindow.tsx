import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";
import { ZIndex } from "sakuraba/const";

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** ターン処理ウインドウ */
export const TurnProcessWindow = (p: {shown: boolean}) => (state: state.State, actions: ActionsType) => {
    if(p.shown){
        if(state.side === 'watcher') return null; // 観戦者は表示しない
        let side = state.side;

        const oncreate = (e) => {
            // ウインドウを移動可能にする
            $(e).draggable({
                cursor: "move", 
                opacity: 0.7,        
                stop: function(){
                    saveWindowState(e);
                },
            });

            // ウインドウの状態を復元
            let windowStateJson = localStorage.getItem(`${e.id}-WindowState`);
            if(windowStateJson){
                let windowState = JSON.parse(windowStateJson);
                $(e).css(windowState);
            } else {
                // 設定がなければ中央に配置
                $(e).css({left: window.innerWidth / 2 - $(e).outerWidth() / 2, top: window.innerHeight / 2 - $(e).outerHeight() / 2});
            }
        };

        let onCardTokenFound = (state.board.objects.find(o => o.type === 'sakura-token' && o.region === 'on-card') ? true : false);

        return (
            <div id="TURN-PROCESS-WINDOW"
             style={{position: 'absolute', height: "40rem", width: "30rem", backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: ZIndex.FLOAT_WINDOW}}
              class="ui segment draggable ui-widget-content"
              oncreate={oncreate}>
                <div class="ui top attached label">ターン進行<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleTurnProcessVisible()}><i class="times icon"></i></a></div>
                <div>
                    <div class="ui vertical menu" style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                        <a class="item" onclick={() => actions.oprSetVigor({side: side, value: state.board.vigors[state.side] + 1})}>
                            集中力+1 （もしくは畏縮の解除）
                        </a>
                    </div>
                    <div class="ui vertical menu" style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                        <a id="ALL-ENHANCE-DECREASE-BUTTON" class={`item ${onCardTokenFound ? '' : 'disabled'}`} onclick={() => actions.oprRemoveSakuraTokenfromAllEnhanceCard}>
                            全付与札の桜花結晶-1
                        </a>
                    </div>
                    <div class="ui vertical menu" style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                        <a id="RESHUFFLE-BUTTON" class="item" onclick={() => actions.oprReshuffle({side: side, lifeDecrease: true})}>
                            再構成
                        </a>
                    </div>
                    <div class="ui vertical menu" style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                        <a class="item" onclick={() => actions.oprDraw({number: 2, cardNameLogging: true})}>
                            カードを2枚引く
                        </a>
                    </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}
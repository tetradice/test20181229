import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";
import { ZIndex } from "sakuraba/const";
import { CARD_DATA } from "sakuraba";

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

        // 特定のカードが場に出ている場合、追加の処理を表示
        let additionals: hyperapp.Children[] = [];

        // 使用済みの切り札にターン開始時効果を持つカードがあれば、効果を発動
        let startEffectCards = state.board.objects.filter(o => o.type === 'card' && o.side === side && o.specialUsed && /あなたの開始フェイズの開始時に/.test(CARD_DATA[o.cardId].text)) as state.Card[];
        startEffectCards.forEach(c => {
            additionals.push(<li>ターン開始時に「{CARD_DATA[c.cardId].name}」の効果発動</li>);
        });
        // 伏せ札に「設置」を持つカードがあれば、設置カードを使用可能である旨を表示
        if(state.board.objects.find(o => o.type === 'card' && o.side === side && o.region === 'hidden-used' && /設置/.test(CARD_DATA[o.cardId].text))){
            additionals.push(<li>再構成時に、伏せ札の中から「設置」を持つカード1枚を使用可能</li>);
        }
        // ライラがいれば、帯電解除を行える
        if(state.board.megamis[side].find(x => x === 'raira')){
            additionals.push(<li>再構成時に、使用済のカードの帯電を解除することができる</li>);
        }
        // 使用済みの切り札にターン終了時効果を持つカードがあれば、効果を発動
        let endEffectCards = state.board.objects.filter(o => o.type === 'card' && o.side === side && o.specialUsed && /あなたの終了フェイズに/.test(CARD_DATA[o.cardId].text)) as state.Card[];
        endEffectCards.forEach(c => {
            additionals.push(<li>ターン終了時に「{CARD_DATA[c.cardId].name}」の効果発動</li>);
        });
        // 使用済みの切り札に再起カードがあれば、再起可能
        let reversalCards = state.board.objects.filter(o => o.type === 'card' && o.side === side && o.specialUsed && /【再起】/.test(CARD_DATA[o.cardId].text)) as state.Card[];
        reversalCards.forEach(c => {
            additionals.push(<li>ターン終了時に、条件を満たしていれば「{CARD_DATA[c.cardId].name}」が再起</li>);
        });
        // ユキヒがいれば、傘の開閉を行える
        if(state.board.megamis[side].find(x => x === 'yukihi')){
            additionals.push(<li>ターン終了時に、傘の開閉を行うことができる</li>);
        }

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
                    <div class="ui vertical menu" style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                        <a class="item" onclick={() => actions.oprDraw({number: 2, cardNameLogging: true})}>
                            手札が3枚以上なら、2枚になるように伏せる
                        </a>
                    </div>
                </div>
                <div class="ui message">
                    {additionals}
                </div>
            </div>
        )
    } else {
        return null;
    }
}
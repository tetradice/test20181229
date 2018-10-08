import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top'), width: $(elem).css('width'), height: $(elem).css('height')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** BGM再生ウインドウ */
export const BGMWindow = (p: {shown: boolean}) => (state: state.State, actions: ActionsType) => {
    if(p.shown){
        const bgm = new Audio('http://inazumaapps.info/furuyoni_simulator/deliv/bgm/sword_dance.mp3');
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

            // BGM再生
            bgm.volume = 0.5;
            bgm.loop = true;
            bgm.play();

            // range初期化
            $('#BGM-VOLUME-RANGE').range({
                min: 0,
                max: 100,
                start: 50,
                step: 2,
                onChange: (value) => {
                    bgm.volume = value * 0.01;
                }
            });
        };

        const ondestroy = (target) => {
            bgm.pause();
        };

        return (
            <div id="BGM-PLAY-WINDOW"
             style={{height: "11rem", width: "25rem", backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 500}}
              class="ui segment draggable ui-widget-content resizable"
              oncreate={oncreate}
              ondestroy={ondestroy}>
                <div class="ui top attached label">BGM再生中<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleBgmPlaying()}><i class="times icon"></i></a></div>
                <p><i class="music icon"></i>剣の舞<br />
                Composed by t.tam<br />
                From <a href="https://dova-s.jp/bgm/play3721.html" target="_blank">フリーBGM DOVA-SYNDROME</a></p>
                <div class="ui blue range" id="BGM-VOLUME-RANGE"></div>
            </div>
        )
    } else {
        return null;
    }
}
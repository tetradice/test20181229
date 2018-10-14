import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** BGM再生ウインドウ */
export const BGMWindow = (p: {shown: boolean}) => (state: state.State, actions: ActionsType) => {
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
            } else {
                // 設定がなければ中央に配置
                $(e).css({left: window.innerWidth / 2 - $(e).outerWidth() / 2, top: window.innerHeight / 2 - $(e).outerHeight() / 2});
            }


            // range初期化
            $('#BGM-VOLUME-RANGE').range({
                min: 0,
                max: 100,
                start: 50,
                step: 2,
                onChange: (value) => {
                    let bgm = document.getElementById('BGM') as HTMLAudioElement;
                    bgm.volume = value * 0.01;
                }
            });
        };

        const ondestroy = (target) => {
            let bgm = document.getElementById('BGM') as HTMLAudioElement;
            bgm.pause();
        };

        const bgmData = [
            {key: 'sword_dance', title: '剣の舞', composer: 't.tam', siteTitle: 'フリーBGM DOVA-SYNDROME', url: 'https://dova-s.jp/bgm/play3721.html', bannerUrl: 'http://inazumaapps.info/furuyoni_simulator/deliv/banner/dova-syndrome.gif'}
          , {key: 'elemental_dance', title: '精霊舞い', composer: '秋山裕和', siteTitle: 'フリー音楽素材 H/MIX GALLERY', url: 'http://www.hmix.net/music_gallery/image/buttle.htm', bannerUrl: 'http://inazumaapps.info/furuyoni_simulator/deliv/banner/hmix3.gif'}
        ];
        const onChange = (e: Event) => {
            let bgm = document.getElementById('BGM') as HTMLAudioElement;
            let val = $(e.target).val();
            let bgmItem = bgmData.find(x => x.key === val);
            // 再生中のbgmがあれば止める
            if(bgm){
                bgm.pause();
            }

            if(bgmItem){
                // 新しいBGMを再生
                bgm.src = `http://inazumaapps.info/furuyoni_simulator/deliv/bgm/${bgmItem.key}.mp3`;
                bgm.loop = true;
                bgm.play();

                // 説明を表示
                $('#PLAYING-BGM-DESCRIPTION').html(`Composed by ${bgmItem.composer}<br>From <a href="${bgmItem.url}" target="_blank">${bgmItem.siteTitle}</a><br><a href="${bgmItem.url}" target="_blank"><img src="${bgmItem.bannerUrl}"></a>`);
            } else {

                // 説明をクリア
                $('#PLAYING-BGM-DESCRIPTION').text('');
            }
        };

        return (
            <div id="BGM-PLAY-WINDOW"
             style={{position: 'absolute', height: "16rem", width: "25rem", backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 500}}
              class="ui segment draggable ui-widget-content resizable"
              oncreate={oncreate}
              ondestroy={ondestroy}>
                <div class="ui top attached label">BGM再生<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleBgmPlaying()}><i class="times icon"></i></a></div>
                <div>
                    <div class="ui selection dropdown" oncreate={(e) => $(e).dropdown('set selected', '-')}>

                        <input type="hidden" name="selectedMusic" onchange={onChange} />
                        <i class="dropdown icon"></i>
                        <div class="default text"></div>
                        <div class="menu">
                            <div class="item" data-value="-">(曲を選択)</div>
                            {bgmData.map(item => <div class="item" data-value={item.key}><i class="music icon"></i> {item.title}</div>)}
                        </div>
                    </div>
                </div>
                <p id="PLAYING-BGM-DESCRIPTION" style={{marginTop: '1em'}}>
                    
                </p>
                <div style={{position: 'absolute', bottom: '0.8em', width: '100%'}}>
                    <div style={{float: 'left'}}><i class="volume up icon"></i></div>
                    <div style={{marginLeft: '1.5rem', width: '90%'}} class="ui blue range" id="BGM-VOLUME-RANGE"></div>
                </div>
                <audio id="BGM"></audio>
            </div>
        )
    } else {
        return null;
    }
}
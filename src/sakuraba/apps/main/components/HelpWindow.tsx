import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";
import { ZIndex } from "sakuraba/const";
import { t } from "i18next";

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

        let contentDiv: JSX.Element;
        if(state.side === 'watcher'){
        } else if(!state.board.mariganFlags[state.side]){
            contentDiv = (
                <div>
                    <h4><i class="icon question circle outline"></i>{t('help-window:決闘準備中の操作方法')}</h4>
                    <p>{utils.nl2brJsx(t('help-window:ボード上に表示されたボタンを押して、準備を進めてください。メガミ選択、デッキ構築、手札の引き直しが終わると決闘開始となります。'))}</p>
                </div>
            );
        } else {
            let rairaFound = state.board.megamis[state.side][0] === 'raira' || state.board.megamis[state.side][1] === 'raira';
            contentDiv = (
                <div>
                    <h4><i class="icon question circle outline"></i>{t('help-window:決闘中の操作方法')}</h4>
                    <p><strong>{t('help-window:カード/桜花結晶をドラッグ')}:</strong> {t('help-window:移動')}<br />
                        <strong>{t('help-window:山札をダブルクリック')}:</strong> {t('help-window:カードを1枚引く')}<br />
                        <strong>{t('help-window:切札をダブルクリック')}:</strong> {t('help-window:切札を表向き(使用済み)にする')}
                </p>
                    <ul>
                        <li>{utils.nl2brJsx(t('help-window:再構成を行うときは、自分の山札の上で右クリック'))}</li>
                        <li>{utils.nl2brJsx(t('help-window:畏縮させるときは、集中力の上で右クリック'))}</li>
                        <li>{utils.nl2brJsx(t('help-window:手札を相手に公開するときは、手札の上で右クリック'))}</li>
                        <li>{utils.nl2brJsx(t('help-window:カードを封印したい時には、使用済み領域にある封印先のカードの上にドラッグ（[論破]などの一部カードにのみ封印可能）'))}</li>
                        <li>{utils.nl2brJsx(t('help-window:カードをゲームから取り除きたい場合は、追加札領域へ移動（[風魔招来孔]などの一部カードのみ実行可能）'))}</li>
                        {rairaFound ? <li>{utils.nl2brJsx(t('help-window:カードの帯電を解除したい場合は、表向きのカードの上で右クリック'))}</li> : null}
                    </ul>
                </div>
            );
        }

        return (
            <div id="HELP-WINDOW"
             style={{position: 'absolute', width: "45rem", backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: ZIndex.FLOAT_WINDOW}}
              class="ui segment draggable ui-widget-content resizable"
              oncreate={oncreate}>
                <div class="ui top attached label">{t('操作説明')}<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleHelpVisible()}><i class="times icon"></i></a></div>
                {contentDiv}
            </div>
        )
    } else {
        return null;
    }
}
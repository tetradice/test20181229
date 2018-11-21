import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";
import { ZIndex } from "sakuraba/const";
import { MEGAMI_DATA, CARD_DATA, CardDataItem, Megami } from "sakuraba";
import dragInfo from "sakuraba/dragInfo";

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** カードリストウインドウ */
export const CardListWindow = (p: {shown: boolean}) => (state: state.State, actions: ActionsType) => {
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

            // SemanticUI ポップアップ初期化
            $(e).find('[data-html]').popup({
                hoverable: true,
                delay: {show: 500, hide: 0},
                onShow: function(): false | void{
                    if(dragInfo.draggingFrom !== null) return false;
                },
                lastResort: true
            });
        };
        let options: JSX.Element[] = [];
        for(let key in MEGAMI_DATA){
            let data = MEGAMI_DATA[key];
            options.push(<option value={key} selected={key === state.cardListSelectedMegami}>{data.name} ({data.symbol})</option>);
        }

        let trs: JSX.Element[] = [];
        let cardIds = utils.getMegamiCardIds(state.cardListSelectedMegami, null, true);
        cardIds.map(id => CARD_DATA[id]).forEach((c, i) => {
            let typeCaptions = [];
            if(c.types.indexOf('attack') >= 0) typeCaptions.push(<span class='card-type-attack'>攻撃</span>);
            if(c.types.indexOf('action') >= 0) typeCaptions.push(<span class='card-type-action'>行動</span>);
            if(c.types.indexOf('enhance') >= 0) typeCaptions.push(<span class='card-type-enhance'>付与</span>);
            if(c.types.indexOf('variable') >= 0) typeCaptions.push(<span class='card-type-variable'>不定</span>);
            if(c.types.indexOf('reaction') >= 0) typeCaptions.push(<span class='card-type-reaction'>対応</span>);
            if(c.types.indexOf('fullpower') >= 0) typeCaptions.push(<span class='card-type-fullpower'>全力</span>);

            trs.push(
                <tr class={c.baseType === 'special' ? 'warning' : null} data-html={utils.getDescriptionHtml(cardIds[i])}>
                    <td>{c.name}</td>
                    <td>{(typeCaptions.length === 2 ? [typeCaptions[0], '/', typeCaptions[1]] : typeCaptions[0])}</td>
                    <td>{c.range}</td>
                    <td>{(c.baseType === 'special' ? c.cost : '')}</td>
                </tr>
            )
        });

        let contentDiv: JSX.Element;

        const onchange = (e: Event) => {
            actions.changeCardListSelectedMegami($(e.target).val() as Megami);
        };

        contentDiv = (
            <div>
                <div class="ui form">
                    <div class="fields">
                        <div class="field">
                            <select onchange={onchange}>
                                {options}
                            </select>
                        </div>
                    </div>
                </div>
                <table class="ui small celled table" style={{background: `transparent`}}>
                    <thead>
                    <tr>
                        <th>名称</th>
                        <th>タイプ</th>
                        <th>適正距離</th>
                        <th>消費</th>
                    </tr>
                    </thead>
                    <tbody>
                    {trs}
                    </tbody>
                </table>
            </div>
        );

        return (
            <div id="CARD-LIST-WINDOW"
             style={{position: 'absolute', width: "45rem", backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: ZIndex.FLOAT_WINDOW}}
              class="ui segment draggable ui-widget-content resizable"
              oncreate={oncreate}>
                <div class="ui top attached label">カードリスト<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleCardListVisible()}><i class="times icon"></i></a></div>
                {contentDiv}
            </div>
        )
    } else {
        return null;
    }
}
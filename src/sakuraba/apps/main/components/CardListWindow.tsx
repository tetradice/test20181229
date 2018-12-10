import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";
import { ZIndex } from "sakuraba/const";
import { MEGAMI_DATA, CARD_DATA, CardDataItem, Megami, CARD_SET_NAMES, CARD_SORT_KEY_MAP } from "sakuraba";
import dragInfo from "sakuraba/dragInfo";
import { css } from 'emotion'
import { t } from "i18next";

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** カードリストウインドウ */
export const CardListWindow = (p: {shown: boolean}) => (state: state.State, actions: ActionsType) => {
    if(p.shown){
        const setPopup = (elem) => {
            // SemanticUI ポップアップ初期化
            $(elem).find('[data-html]').popup({
                hoverable: true,
                delay: {show: 500, hide: 0},
                onShow: function(): false | void{
                    if(dragInfo.draggingFrom !== null) return false;
                },
                lastResort: true
            });

        };

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

            setPopup(e);

        };
        const onupdate = (e) => {
            setPopup(e);
        };


        let options: JSX.Element[] = [];
        for (let key of utils.getMegamiKeys(state.board.cardSet)) {
            let data = MEGAMI_DATA[key];
            options.push(<option value={key} selected={key === state.cardListSelectedMegami}>{data.name} ({data.symbol})</option>);
        }

        let trs: JSX.Element[] = [];
        for (let cardId of utils.getMegamiCardIds(state.cardListSelectedMegami, state.board.cardSet, null, true)) {
            let c = CARD_DATA[state.board.cardSet][cardId];
            let typeCaptions = [];
            if(c.types.indexOf('attack') >= 0) typeCaptions.push(<span class='card-type-attack'>{t('攻撃')}</span>);
            if(c.types.indexOf('action') >= 0) typeCaptions.push(<span class='card-type-action'>{t('行動')}</span>);
            if(c.types.indexOf('enhance') >= 0) typeCaptions.push(<span class='card-type-enhance'>{t('付与')}</span>);
            if(c.types.indexOf('variable') >= 0) typeCaptions.push(<span class='card-type-variable'>{t('不定')}</span>);
            if(c.types.indexOf('reaction') >= 0) typeCaptions.push(<span class='card-type-reaction'>{t('対応')}</span>);
            if(c.types.indexOf('fullpower') >= 0) typeCaptions.push(<span class='card-type-fullpower'>{t('全力')}</span>);

            trs.push(
                <tr class={c.baseType === 'special' ? 'warning' : null} data-html={utils.getDescriptionHtml(state.board.cardSet, cardId)}>
                    <td>{c.extraFrom ? '≫ ' : ''}{c.name}</td>
                    <td>{(typeCaptions.length === 2 ? [typeCaptions[0], '/', typeCaptions[1]] : typeCaptions[0])}</td>
                    <td>{(c.rangeOpened ? `${t('[閉]')}${c.range} ${t('[開]')}${c.rangeOpened}` : c.range)}</td>
                    <td>{(c.baseType === 'special' ? c.cost : '')}</td>
                </tr>
            )
        }

        let contentDiv: JSX.Element;

        const onchange = (e: Event) => {
            actions.changeCardListSelectedMegami($(e.target).val() as Megami);
        };

        const cardSetCss = css`
            position: absolute;
            right: 1em;
            color: silver;
            font-size: smaller;
        `;

        contentDiv = (
            <div style={{overflowY: 'auto', maxHeight: "85vh", paddingRight: "1em"}}>
                <div class="ui form">
                    <div class="inline fields">
                        <div class="field">
                            <select onchange={onchange}>
                                {options}
                            </select>
                        </div>
                        <div class={cardSetCss}>{t('カードセット')}: {CARD_SET_NAMES[state.board.cardSet]}</div>
                    </div>
                </div>
                <table class="ui small celled selectable table" style={{background: `transparent`}}>
                    <thead>
                    <tr>
                        <th class="seven wide">{t('名称')}</th>
                        <th class="four wide">{t('タイプ')}</th>
                        <th class="three wide">{t('適正距離')}</th>
                        <th class="two wide">{t('消費')}</th>
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
              oncreate={oncreate} onupdate={onupdate}>
                <div class="ui top attached label">{t('カードリスト')}<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleCardListVisible()}><i class="times icon"></i></a></div>
                {contentDiv}
            </div>
        )
    } else {
        return null;
    }
}
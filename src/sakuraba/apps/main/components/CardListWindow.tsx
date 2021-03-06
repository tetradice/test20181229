import { h } from "hyperapp";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";
import { ZIndex } from "sakuraba/const";
import { MEGAMI_DATA, Megami } from "sakuraba";
import dragInfo from "sakuraba/dragInfo";
import { css } from 'emotion'
import { t } from "i18next";
import * as models from "sakuraba/models";
import { Card } from "sakuraba/apps/common/components";

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
                variation: 'wide',
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
            options.push(<option value={key} selected={key === state.cardListSelectedMegami}>{utils.getMegamiDispNameWithSymbol(state.setting.language.uniqueName, key)}</option>);
        }

        // 画像表示ONかどうかで処理変更
        let cardList: hyperapp.Children = null;
        if(state.setting.cardImageEnabledTestEn){
            let cards: hyperapp.Children[] = [];
            let i = 0;
            for (let cardId of utils.getMegamiCardIds(state.cardListSelectedMegami, state.board.cardSet, null, true)) {
                let c = new models.CardData(state.board.cardSet, cardId, state.detectedLanguage, state.setting.language, state.setting.cardImageEnabledTestEn);
                let card = utils.createCard(`cardlist-${cardId}`, cardId, null, 'p1');
                card.openState = 'opened';
                cards.push(
                    <Card clickableClass target={card} cardData={c} opened descriptionViewable left={((i % 5) * 120)} top={Math.floor(i / 5) * 150} zoom={state.zoom}></Card>
                )
                i++;
            }

            cardList = (
                <div style={{position: 'relative', height: '460px', width: '500px'}}>
                    {cards}
                </div>
            );

        } else {
            let trs: JSX.Element[] = [];
            for (let cardId of utils.getMegamiCardIds(state.cardListSelectedMegami, state.board.cardSet, null, true)) {
                let c = new models.CardData(state.board.cardSet, cardId, state.detectedLanguage, state.setting.language, state.setting.cardImageEnabledTestEn);
                let typeCaptions = [];
                if (c.types.indexOf('attack') >= 0) typeCaptions.push(<span class='card-type-attack'>{t('攻撃')}</span>);
                if (c.types.indexOf('action') >= 0) typeCaptions.push(<span class='card-type-action'>{t('行動')}</span>);
                if (c.types.indexOf('enhance') >= 0) typeCaptions.push(<span class='card-type-enhance'>{t('付与')}</span>);
                if (c.types.indexOf('variable') >= 0) typeCaptions.push(<span class='card-type-variable'>{t('不定')}</span>);
                if (c.types.indexOf('reaction') >= 0) typeCaptions.push(<span class='card-type-reaction'>{t('対応')}</span>);
                if (c.types.indexOf('fullpower') >= 0) typeCaptions.push(<span class='card-type-fullpower'>{t('全力')}</span>);

                trs.push(
                    <tr class={c.baseType === 'special' ? 'warning' : null} data-html={c.getDescriptionHtml()}>
                        <td>{c.extraFrom ? t('≫ CARDNAME', { cardName: c.name }) : c.name}</td>
                        <td>{(typeCaptions.length === 2 ? [typeCaptions[0], '/', typeCaptions[1]] : typeCaptions[0])}</td>
                        <td>{(c.rangeOpened ? `${t('[閉]')}${c.range} ${t('[開]')}${c.rangeOpened}` : c.range)}</td>
                        <td>{(c.baseType === 'special' ? c.cost : '')}</td>
                    </tr>
                )
            }

            cardList = (
                <table class="ui small celled selectable table" style={{ background: `transparent` }}>
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
            );
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
                        <div class={cardSetCss}>{t('カードセット')}: {utils.getCardSetName(state.board.cardSet)}</div>
                    </div>
                </div>
                {cardList}
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
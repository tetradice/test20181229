import { h, app, View } from "hyperapp";
import { DeckBuildCard } from "../common/components";
import { actions, ActionsType } from "./actions";
import { State } from "./state";
import * as utils from "sakuraba/utils";
import * as sakuraba from "sakuraba";

import * as css from "./view.css"

/** ポップアップ初期化 */
function setPopup(){
    // ポップアップ初期化
    $('[data-html],[data-content]').popup({
        delay: {show: 500, hide: 0},
        onShow: function(): false | void{
            //if(draggingFrom !== null) return false;
        },
    });
}
// メインビューの定義
const view: View<State, ActionsType> = (state, actions) => {
    if(!state.shown) return null;

    let cardElements: JSX.Element[] = [];
    state.cardIds.forEach((cardId, c) => {
        let card = utils.createCard(`deck-${cardId}`, cardId, null, state.side);
        card.opened = true;
        let top = 4;
        let left = 4 + c * (100 + 8);
        let selected = state.selectedCardIds.indexOf(cardId) >= 0;
        
        cardElements.push(<DeckBuildCard target={card} left={left} top={top} selected={selected} onclick={() => actions.selectCard(cardId)} zoom={1.0}></DeckBuildCard>);
    });

    let selectedCount = state.selectedCardIds.filter(cardId => sakuraba.CARD_DATA[cardId].baseType === 'normal').length;

    let okButtonClass = "ui positive labeled icon button";
    if(selectedCount === 0) okButtonClass += " disabled";

    return(
        <div class={"ui dimmer modals page visible active " + css.modalTop} oncreate={() => setPopup()}>
            <div class="ui modal visible active">
                <div class="content">
                    <div class="description" style={{marginBottom: '2em'}}>
                        <p>山札の底に戻すカードを選択してください。（この操作は一度しか行えません）</p>
                    </div>
                    <div class={css.outer}>
                        <div class={css.cardArea} id="DECK-BUILD-CARD-AREA">
                            {cardElements}
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <div class={okButtonClass} onclick={() => {actions.hide(); state.promiseResolve(state.selectedCardIds)}}>
                        決定 <i class="checkmark icon"></i>
                    </div>
                    <div class="ui black deny button" onclick={() => {actions.hide(); state.promiseReject()}}>
                        キャンセル
                    </div>
                </div>
            </div>
        </div>
    );
}

export default view;
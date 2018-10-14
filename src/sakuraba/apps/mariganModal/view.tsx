import { h, app, View } from "hyperapp";
import { actions, ActionsType } from "./actions";
import { State } from "./state";
import * as utils from "sakuraba/utils";
import * as sakuraba from "sakuraba";
import { Card } from "sakuraba/apps/common/components";

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
    state.cards.forEach((card, c) => {
        let sCard = utils.createCard(`deck-${card.id}`, card.id, null, state.side);
        sCard.openState = 'opened';
        let top = 4;
        let left = 4 + c * (100 + 8);
        let selected = state.selectedCards.indexOf(card) >= 0;
        
        cardElements.push(<Card clickableClass target={card} opened descriptionViewable left={left} top={top} selected={selected} onclick={() => actions.selectCard(card)} zoom={state.zoom}></Card>);
    });

    let selectedCount = state.selectedCards.filter(card => sakuraba.CARD_DATA[card.cardId].baseType === 'normal').length;

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
                    <div class={okButtonClass} onclick={() => {actions.hide(); state.promiseResolve(state.selectedCards)}}>
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
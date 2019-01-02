import { h, app, View } from "hyperapp";
import { actions, ActionsType } from "./actions";
import { State } from "./state";
import * as utils from "sakuraba/utils";
import * as models from "sakuraba/models";
import * as sakuraba from "sakuraba";
import { Card } from "sakuraba/apps/common/components";

import * as css from "./view.css"
import { t } from "i18next";

/** ポップアップ初期化 */
function setPopup(){
    // ポップアップ初期化
    $('[data-html],[data-content]').popup({
        variation: 'wide',
        delay: {show: 500, hide: 0},
        onShow: function(): false | void{
            //if(draggingFrom !== null) return false;
            
        },
        lastResort: true
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
        let selectedIndex = state.selectedCards.indexOf(card);
        let selected = selectedIndex >= 0;
        
        const onclick = (e) => {
            actions.selectCard(card);            

            let $okButton = $('#COMMON-MODAL .ui.button.positive');
            let currentSelectedCount = actions.getState().selectedCards.filter(card => sakuraba.CARD_DATA[state.cardSet][card.cardId].baseType === 'normal').length;
            if (currentSelectedCount === 0) {
                $okButton.addClass('disabled');
            } else {
                $okButton.removeClass('disabled');
            }
        };
        
        cardElements.push(<Card clickableClass target={card} cardData={new models.CardData(state.cardSet, card.cardId, state.detectedLanguage, state.setting.language, state.setting.cardImageEnabledTestEn)} opened descriptionViewable left={left} top={top} selected={selected} selectedIndex={(selected ? selectedIndex : null)} onclick={onclick} zoom={state.zoom}></Card>);
    });

    const oncreate = (elem: HTMLElement) => {
        $(elem).modal({
            onShow: () => {
                let $okButton = $('#COMMON-MODAL .ui.button.positive');
                $okButton.addClass('disabled');
            },
            onApprove: function(): void | false{
                let currentState = actions.getState();
                currentState.promiseResolve(currentState.selectedCards);
                return false; // 自動で非表示にしない (終了後に次のモーダルを表示するため)
            },
            onHidden: () => {
                actions.hide();
            }
        }).modal('show');
    };

    return(

        <div id="COMMON-MODAL" class="ui modal small" oncreate={oncreate}>
            <div class="content">
                <div class="description" style={{marginBottom: '2em'}}>
                    <p>{utils.nl2brJsx(t('dialog:山札の底に戻すカードを選択してください。（この操作は一度しか行えません）'))}</p>
                </div>
                <div class={css.outer}>
                    <div class={css.cardArea} id="DECK-BUILD-CARD-AREA">
                        {cardElements}
                    </div>
                </div>
                <div class="description" style={{marginTop: '1em'}}>
                    <p>{t('※選択した順番でカードを底に置く順番が決まり、「1」と表示されているカードが一番上に置かれます。')}</p>
                </div>
            </div>
            <div class="actions">
                <div class="ui positive labeled icon button">
                    {t('決定')} <i class="checkmark icon"></i>
                </div>
                <div class="ui black deny button">
                    {t('キャンセル')}
                </div>
            </div>
        </div>

    );
}

export default view;
import { h, app, View } from "hyperapp";
import { actions, ActionsType } from "./actions";
import { State } from "./state";
import * as utils from "sakuraba/utils";
import * as models from "sakuraba/models";
import * as sakuraba from "sakuraba";
import { Card } from "sakuraba/apps/common/components";

import * as css from "./view.css"
import { t } from "i18next";
import { MEGAMI_DATA, Megami } from "sakuraba";

/** ポップアップ初期化 */
function setPopup() {
    // ポップアップ初期化
    $('[data-html],[data-content]').popup({
        variation: 'wide',
        delay: { show: 500, hide: 0 },
        onShow: function (): false | void {
            //if(draggingFrom !== null) return false;

        },
        lastResort: true
    });
}
// メインビューの定義
const view: View<State, ActionsType> = (state, actions) => {
    if (!state.shown) return null;

    let cardElements: JSX.Element[] = [];
    let i = 0;
    for(let key in MEGAMI_DATA){
        let megami = key as Megami;
        let top = 4;
        let left = 4 + i * (100 + 8);
        let selectedIndex = state.selectedMegamis.indexOf(megami);
        let selected = selectedIndex >= 0;

        const onclick = (e) => {
            actions.selectMegami(megami);

            let $okButton = $('#COMMON-MODAL .ui.button.positive');
            let currentSelectedCount = actions.getState().selectedMegamis.filter(card => sakuraba.CARD_DATA[state.cardSet][card.cardId].baseType === 'normal').length;
            if (currentSelectedCount === 0) {
                $okButton.addClass('disabled');
            } else {
                $okButton.removeClass('disabled');
            }
        };

        cardElements.push(<Card clickableClass target={card} cardData={new models.CardData(state.cardSet, card.cardId, state.setting.language, state.setting.cardImageEnabledTestEn)} opened descriptionViewable left={left} top={top} selected={selected} selectedIndex={(selected ? selectedIndex : null)} onclick={onclick} zoom={state.zoom}></Card>);

        i++;
    });

    const okProc = () => {
        const decide = function () {
            actions.hide();
            let currentState = actions.getState();
            currentState.promiseResolve(currentState.selectedMegamis);
        }
    };

    const oncreate = (elem: HTMLElement) => {
        $('#COMMON-MODAL').modal({
            onApprove: () => {
                okProc();
            },
            onHidden: () => {
                actions.hide();
            }
        }).modal('show');
    };

    return (
        <div class="content" oncreate={oncreate}>
            <div class="description" style={{ marginBottom: '2em' }}>
                <p>{utils.nl2brJsx(t('dialog:山札の底に戻すカードを選択してください。（この操作は一度しか行えません）'))}</p>
            </div>
            <div class={css.outer}>
                <div class={css.cardArea} id="DECK-BUILD-CARD-AREA">
                    {cardElements}
                </div>
            </div>
            <div class="description" style={{ marginTop: '1em' }}>
                <p>{t('※選択した順番でカードを底に置く順番が決まり、「1」と表示されているカードが一番上に置かれます。')}</p>

            </div>
        </div>
    );
}

export default view;
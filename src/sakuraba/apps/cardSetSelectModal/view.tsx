import { h, app, View } from "hyperapp";
import { actions, ActionsType } from "./actions";
import { State } from "./state";
import * as utils from "sakuraba/utils";
import { Card } from "sakuraba/apps/common/components";

import * as css from "./view.css"
import { CARD_SET_NAMES, CARD_SET_DESCRIPTIONS } from "sakuraba";

// メインビューの定義
const view: View<State, ActionsType> = (state, actions) => {
    if (!state.shown) return null;

    let cardSetOptions: hyperapp.Children[] = [];
    for (let cardSet in CARD_SET_DESCRIPTIONS) {
        cardSetOptions.push(<option value={cardSet} selected={state.selectedCardSet === cardSet}>{CARD_SET_DESCRIPTIONS[cardSet]}</option>);
    }

    const onChange = (e) => {
        let changedCardSet = $(e.target).val() as CardSet;
        console.log('changed: ', changedCardSet);
        actions.selectCardSet(changedCardSet);
    };

    console.log(state.selectedCardSet);

    return (
        <div class={"ui dimmer modals page visible active " + css.modalTop}>
            <div class="ui modal visible active">
                <div class="content">
                    <div class="description" style="margin-bottom: 2em;">
                        <p>使用するカードセットを選択してください。</p>
                    </div>
                    <div class="ui form">
                        <div class="fields">
                            <div class="field">
                                <select id="CARDSET-SELECTION" name="cardSet" onchange={onChange}>
                                    {cardSetOptions}
                                </select>
                            </div>
                        </div>
                        <div class="ui error message"></div>
                    </div>
                </div>
                <div class="actions">
                    <div class="ui positive labeled icon button" onclick={() => { actions.hide(); state.promiseResolve(state.selectedCardSet) }}>
                        決定 <i class="checkmark icon"></i>
                    </div>
                    <div class="ui black deny button" onclick={() => { actions.hide(); state.promiseReject() }}>
                        キャンセル
                    </div>
                </div>
            </div>
        </div>
    );
}

export default view;
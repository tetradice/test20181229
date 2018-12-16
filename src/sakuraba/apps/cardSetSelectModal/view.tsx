import { h, View } from "hyperapp";
import { CARD_SETS } from "sakuraba";
import * as utils from "sakuraba/utils";
import { ActionsType } from "./actions";
import { State } from "./state";

// メインビューの定義
const view: View<State, ActionsType> = (state, actions) => {
    if (!state.shown) return null;

    let cardSetOptions: hyperapp.Children[] = [];
    for (let cardSet of CARD_SETS) {
        cardSetOptions.push(<option value={cardSet} selected={state.selectedCardSet === cardSet}>{utils.getCardSetDescription(cardSet)}</option>);
    }

    const onChange = (e) => {
        let changedCardSet = $(e.target).val() as CardSet;
        actions.selectCardSet(changedCardSet);
    };

    const okProc = () => {
        const decide = function(){
            actions.hide();
            let currentState = actions.getState();
            currentState.promiseResolve(currentState.selectedCardSet);
        }

        // 確認メッセージ
        utils.confirmModal("カードセットを変更すると、卓は初期状態に戻ります。<br>（操作ログは初期化されません）<br>この操作は相手プレイヤーに確認を取ってから行ってください。<br><br>よろしいですか？", decide);
    };

    const oncreate = (elem: HTMLElement) => {
        $('#COMMON-MODAL').modal({
            onApprove: () => {
                okProc();
            },
            onDeny: () => {
                // let currentState = actions.getState();
                // currentState.promiseReject();
            },
            onHidden: () => {
                actions.hide();
            }
        }).modal('show');
    };

    return (
        <div class="content" oncreate={oncreate}>
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
    );
}

export default view;
import { h, View } from "hyperapp";
import { ActionsType } from "./actions";
import { State } from "./state";
import { Modal } from "../common/components";

// メインビューの定義
const view: View<State, ActionsType> = (state, actions) => {
    if (!state.shown) return null;

    const onApprove = () => {
        actions.hide();
        let currentState = actions.getState();
        currentState.promiseResolve();
    }

    const onHidden = () => {
        actions.hide();
    }

    return (
        <Modal onApprove={onApprove} onHidden={onHidden} closable={false}>
            <div class="description">
                {state.message}
            </div>
        </Modal>
    );
}

export default view;
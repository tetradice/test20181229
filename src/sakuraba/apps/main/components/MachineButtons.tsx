import { h } from "hyperapp";
import { ActionsType } from "../actions";
import _ from "lodash";
import * as models from "sakuraba/models";
import { t } from "i18next";

/** 造花結晶を操作するためのボタン */
export const MachineButtons = (p: {side: PlayerSide, left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , height: `${50 * state.zoom}px`
        , position: 'absolute'
    };

    let boardModel = new models.Board(state.board);
    return (
        <div style={styles}>
            <button class={`mini ui basic button${boardModel.isRideForwardEnabled(p.side, 1) ? '' : ' disabled'}`} onclick={() => actions.oprRideForward({side: p.side, moveNumber: 1})}>{t('騎動前進')}</button>
            <button class={`mini ui basic button${boardModel.isRideBackEnabled(p.side, 1) ? '' : ' disabled'}`} onclick={() => actions.oprRideBack({side: p.side, moveNumber: 1})}>{t('騎動後退')}</button>
        </div>
    );
}
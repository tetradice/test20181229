import { h } from "hyperapp";
import { ActionsType } from "../actions";
import _ from "lodash";
import * as models from "sakuraba/models";

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

    const burn = () => {
        actions.operate({
            log: `マシンの燃料を消費しました`,
            proc: () => {
                actions.moveSakuraToken({from: [p.side, 'machine', null], to: [p.side, 'burned', null]});
            }
        });
    };
    const charge = () => {
        actions.operate({
            log: `マシンの燃料を回復しました`,
            proc: () => {
                actions.moveSakuraToken({from: [p.side, 'burned', null], to: [p.side, 'machine', null]});
            }
        });
    };
    const rideForward = () => {
        actions.operate({
            log: `騎動前進しました`,
            proc: () => {
                actions.moveSakuraToken({from: [p.side, 'machine', null], to: [null, 'distance', null], distanceMinus: true});
            }
        });
    };
    const rideBack = () => {
        actions.operate({
            log: `騎動後退しました`,
            proc: () => {
                actions.moveSakuraToken({from: [p.side, 'machine', null], to: [p.side, 'machine', null]});
            }
        });
    };

    let distanceTokens = boardModel.getRegionSakuraTokens(null, 'distance', null);
    let machineTokens = boardModel.getRegionSakuraTokens(p.side, 'machine', null);
    return (
        <div style={styles}>
            <button class={`mini ui basic button${machineTokens.length === 0 || distanceTokens.length <= 0 ? ' disabled' : ''}`} onclick={rideForward}>騎動前進</button>
            <button class={`mini ui basic button${machineTokens.length === 0 || distanceTokens.length >= 10 ? ' disabled' : ''}`} onclick={rideBack}>騎動後退</button>
        </div>
    );
}
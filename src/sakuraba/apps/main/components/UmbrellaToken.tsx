import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as utils from "sakuraba/utils";
import dragInfo from "sakuraba/dragInfo";

/** 傘 */
export const UmbrellaToken = (p: {side: PlayerSide, umbrellaState: UmbrellaState, left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${50 * state.zoom}px`
        , height: `${50 * state.zoom}px`
        , border: `1px silver solid`
        , borderRadius: `4px`
        , position: 'absolute'
    };
    const onclick = (e) => {
        if(p.side === state.side){
            $('#CONTEXT-UMBRELLA-TOKEN-CLICK').contextMenu({x: e.pageX, y: e.pageY});
        }
    };

    return <img class={(p.side === state.side ? 'clickable' : '')} src={`http://inazumaapps.info/furuyoni_simulator/deliv/furuyoni_commons/furuyoni_na/cards/umbrella_${p.umbrellaState === 'closed' ? 'a' : 'b'}_cut.png`} style={styles} onclick={onclick} />;
}
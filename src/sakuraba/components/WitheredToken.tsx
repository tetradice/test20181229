import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as utils from "../utils";

/** 集中力 */
export const WitheredToken = (p: {side: PlayerSide, left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${80 * state.zoom}px`
        , height: `${89 * state.zoom}px`
    };
    let className = "withered-token clickable";
    if(p.side === utils.flipSide(state.side)) className += " opponent-side"; 

    if(state.board.witherFlags[p.side]){
        return <div class={className} onclick={() => actions.setWitherFlag({side: p.side, value: false})} style={styles}></div>;
    } else {
        return null;
    }
}
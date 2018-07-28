import { h } from "hyperapp";
import { ActionsType } from "../actions";

/** 集中力 */
export const Vigor = (p: {left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left}px`
        , top: `${p.top}px`
    };
    let vigor = state.board.vigors[state.side];
    let className = "fbs-vigor-card";
    if(vigor === 0) className += " rotated";
    if(vigor === 2) className += " reverse-rotated";

    return <div class={className} style={styles}>
        <div class={"vigor0" + (vigor !== 0 ? " clickable" : "")} onclick={() => actions.setVigor({value: 0, side: state.side})}></div>
        <div class={"vigor1" + (vigor !== 1 ? " clickable" : "")} onclick={() => actions.setVigor({value: 1, side: state.side})}></div>
        <div class={"vigor2" + (vigor !== 2 ? " clickable" : "")} onclick={() => actions.setVigor({value: 2, side: state.side})}></div>
    </div>;
}
import { h } from "hyperapp";
import { ActionsType } from "sakuraba/actions";
import * as utils from "sakuraba/utils";

/** 集中力 */
export const MariganButton = (p: {left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , position: 'absolute'
    };

    let onClick = () => {
    }

    return <button style={styles} class={`ui basic button`} onclick={onClick}>手札を引き直す</button>;
}
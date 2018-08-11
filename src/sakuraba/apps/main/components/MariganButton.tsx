import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as utils from "sakuraba/utils";

/** 手札の引き直しボタン */
export const MariganButton = (p: {left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    // まだ最初の手札を引いてない場合か、すでに引き直し済みの場合は表示しない
    if(!state.board.firstDrawFlags[state.side] || state.board.mariganFlags[state.side]){
        return null;
    }

    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , position: 'absolute'
    };

    let onClick = () => {
    }

    return <button style={styles} class={`ui basic button`} onclick={onClick}><span style={{color: 'blue'}}>手札を引き直す</span></button>;
}
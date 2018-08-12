import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as apps from "sakuraba/apps";
import * as models from "sakuraba/models";
import { resolve } from "url";

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
        // マリガンダイアログを起動
        let board = new models.Board(state.board);
        
        let promise = new Promise<string[]>((resolve, reject) => {
            let cardIds = board.getRegionCards(state.side, 'hand').map(c => c.cardId);
            let st = apps.mariganModal.State.create(state.side, cardIds, resolve, reject);
            apps.mariganModal.run(st, document.getElementById('MARIGAN-MODAL'));            
        }).then((selectedCardIds) => {
            // 一部のカードを山札の底に戻し、同じ枚数だけカードを引き直す
        });
    }

    return <button style={styles} class={`ui basic button`} onclick={onClick}><span style={{color: 'blue'}}>手札を引き直す</span></button>;
}
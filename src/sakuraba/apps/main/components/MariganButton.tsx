import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as apps from "sakuraba/apps";
import * as models from "sakuraba/models";
import { resolve } from "url";

/** 手札の引き直しボタン */
export const MariganButton = (p: {left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    if(state.side === 'watcher') return null; // 観戦者は表示しない
    let side = state.side;

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
        
        let promise = new Promise<state.Card[]>((resolve, reject) => {
            let cards = board.getRegionCards(side, 'hand', null);
            let st = apps.mariganModal.State.create(side, cards, state.zoom, resolve, reject);
            apps.mariganModal.run(st, document.getElementById('MARIGAN-MODAL'));            
        }).then((selectedCards) => {
            // 一部のカードを山札の底に戻し、同じ枚数だけカードを引き直す
            actions.operate({
                log: `手札${selectedCards.length}枚を山札の底に置き、同じ枚数のカードを引き直し`,
                proc: () => {
                    // 選択したカードを山札の底に移動
                    selectedCards.forEach(card => {
                        actions.moveCard({from: card.id, to: [side, 'library', null], toPosition: 'first', cardNameLogging: true, cardNameLogTitle: '山札へ戻す'});
                    });

                    // 手札n枚を引く
                    actions.draw({number: selectedCards.length});
        
                    // マリガンフラグON
                    actions.setMariganFlag({side: side, value: true});
                }
            })
        });
    }

    return <button style={styles} class={`ui basic button`} onclick={onClick}><span style={{color: 'blue'}}>手札を引き直す</span></button>;
}
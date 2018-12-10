import { WiredActions } from 'hyperapp-types';
import { State } from './state';

export const actions = {
    hide: () => {
        return {shown: false};
    },
    selectCard: (card: state.Card) => (state: State) => {
        let newSelectedCards = state.selectedCards.concat([]);

        if(newSelectedCards.indexOf(card) >= 0){
            // 選択OFF
            newSelectedCards.splice(newSelectedCards.indexOf(card), 1);
        } else {
            // 選択ON
            newSelectedCards.push(card)
        }

        return {selectedCards: newSelectedCards};
    },

    /** ボードの状態を取得 */
    getState: () => (state: State) => state
};

export type ActionsType = WiredActions<State, typeof actions>;

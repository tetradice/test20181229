import { WiredActions } from 'hyperapp-types';
import { State } from './state';

export const actions = {
    hide: () => {
        return {shown: false};
    },
    selectCard: (cardId: string) => (state: State) => {
        let newSelectedCardIds = state.selectedCardIds.concat([]);

        if(newSelectedCardIds.indexOf(cardId) >= 0){
            // 選択OFF
            newSelectedCardIds.splice(newSelectedCardIds.indexOf(cardId), 1);
        } else {
            // 選択ON
            newSelectedCardIds.push(cardId)
        }

        return {selectedCardIds: newSelectedCardIds};
    },
};

export type ActionsType = WiredActions<State, typeof actions>;

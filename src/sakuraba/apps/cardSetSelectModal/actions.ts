import { WiredActions } from 'hyperapp-types';
import { State } from './state';

export const actions = {
    hide: () => {
        return {shown: false};
    },
    selectCardSet: (cardSet: CardSet) => {
        return { selectedCardSet: cardSet } as Partial<State>;
    },
    
    /** ボードの状態を取得 */
    getState: () => (state: State) => state
};

export type ActionsType = WiredActions<State, typeof actions>;

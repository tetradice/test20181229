import { WiredActions } from 'hyperapp-types';
import { State } from './state';

export const actions = {
    hide: () => {
        return {shown: false};
    },
    selectCardSet: (cardSet: CardSet) => {
        return { selectedCardSet: cardSet } as Partial<State>;
    },
};

export type ActionsType = WiredActions<State, typeof actions>;

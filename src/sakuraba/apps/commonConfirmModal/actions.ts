import { WiredActions } from 'hyperapp-types';
import { State } from './state';

export const actions = {
    hide: () => {
        return {shown: false};
    },
    
    getState: () => (state: State) => state
};

export type ActionsType = WiredActions<State, typeof actions>;

import { WiredActions } from 'hyperapp-types';
import { State } from './state';
import { Megami } from 'sakuraba';

export const actions = {
    hide: () => {
        return {shown: false};
    },
    selectMegami: (megami: Megami) => (state: State) => {
        let newSelectedMegamis = state.selectedMegamis.concat([]);

        if(newSelectedMegamis.indexOf(megami) >= 0){
            // 選択OFF
            newSelectedMegamis.splice(newSelectedMegamis.indexOf(megami), 1);
        } else {
            // 選択ON
            newSelectedMegamis.push(megami)
        }

        return {selectedMegamis: newSelectedMegamis};
    },

    /** ボードの状態を取得 */
    getState: () => (state: State) => state
};

export type ActionsType = WiredActions<State, typeof actions>;

import * as utils from './utils'
import State from './state'

type PState = Partial<State>;

interface TAction {
    updateSakuraTokens: () => (state: State) => PState;
}

const actions: TAction = {
    /** 桜花結晶トークンの領域情報を更新 */
    updateSakuraTokens: () => (state) => {
        // res.sakuraTokens = [];

        // utils.loop(state.board.distance, (i) => {
        //     res.sakuraTokens.push({region: 'distance', indexOfRegion: i});
        // });
        // utils.loop(state.board.dust, (i) => {
        //     res.sakuraTokens.push({region: 'dust', indexOfRegion: i});
        // });
        return {sakuraTokens: null};
        
    }
};

export default actions;
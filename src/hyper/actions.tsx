import * as utils from './utils'
import State from './state'

const actions = {
    /** 桜花結晶トークンの領域情報を更新 */
    updateSakuraTokens: () => (state: State) => {
        let res: Partial<State> = {};
        res.sakuraTokens = [];

        utils.loop(state.board.distance, (i) => {
            res.sakuraTokens.push({region: 'distance', indexOfRegion: i});
        });
        utils.loop(state.board.dust, (i) => {
            res.sakuraTokens.push({region: 'dust', indexOfRegion: i});
        });
        
    }
};

export default actions;
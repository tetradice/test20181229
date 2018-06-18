import * as  _ from "lodash";
import * as utils from "../utils";

export default {
    /** ボード全体を設定する */
    setBoard: (newBoard: state.Board) => {
        return {board: newBoard};
    },

    /** ボード全体を初期化する */
    resetBoard: () => {
        return {board: utils.createInitialState().board};
    },

    /** 指定したサイドのプレイヤー名を設定する */
    setPlayerName: (side: PlayerSide, newName: string) => (state: state.State) => {
        let newBoard = _.merge({}, state.board);
        newBoard.playerNames[side] = newName;
        
        return {board: newBoard};
    },


    /** ボードの状態を取得 */
    getState: () => (state: state.State) => state
}
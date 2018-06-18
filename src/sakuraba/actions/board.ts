import * as  _ from "lodash";
import * as utils from "../utils";
import { Megami } from "../../sakuraba";

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
    setPlayerName: (args: {side: PlayerSide, name: string}) => (state: state.State) => {
        let newBoard = _.merge({}, state.board);
        newBoard.playerNames[args.side] = args.name;
        
        return {board: newBoard};
    },

    /** 指定したサイドのメガミを設定する */
    setMegamis: (args: {side: PlayerSide, megami1: Megami, megami2: Megami}) => (state: state.State) => {
        let newBoard = _.merge({}, state.board);
        newBoard.megamis[args.side] = [args.megami1, args.megami2];
        
        return {board: newBoard};
    },

    /** ボードの状態を取得 */
    getState: () => (state: state.State) => state
}
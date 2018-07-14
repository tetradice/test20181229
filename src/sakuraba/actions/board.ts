import * as  _ from "lodash";
import * as utils from "../utils";
import { Megami } from "../../sakuraba";
import cardActions from './card';

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
    setPlayerName: (p: {side: PlayerSide, name: string}) => (state: state.State) => {
        let newBoard = _.merge({}, state.board);
        newBoard.playerNames[p.side] = p.name;
        
        return {board: newBoard};
    },

    /** 指定したサイドのメガミを設定する */
    setMegamis: (p: {side: PlayerSide, megami1: Megami, megami2: Megami}) => (state: state.State) => {
        let newBoard = _.merge({}, state.board);
        newBoard.megamis[p.side] = [p.megami1, p.megami2];
        
        return {board: newBoard};
    },

    /** デッキのカードを設定する */
    setDeckCards: (p: {cardIds: string[]}) => (state: state.State, actions: typeof cardActions) => {
        p.cardIds.forEach((id) => {
            actions.addCard({region: 'library', cardId: id});
        });
    },

    /** ボードの状態を取得 */
    getState: () => (state: state.State) => state
}
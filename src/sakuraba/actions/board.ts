import * as  _ from "lodash";
import * as models from "../models";
import * as utils from "../utils";
import { Megami, CARD_DATA } from "../../sakuraba";
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

    /** ボードの状態をUndo用に記憶 */
    memorizeBoard: () => (state: state.State) => {
        return {boardHistoryPast: state.boardHistoryPast.concat([state.board])};
    },

    /** Undo */
    UndoBoard: () => (state: state.State) => {
        let newPast = state.boardHistoryPast.concat(); // clone array
        let newFuture = state.boardHistoryFuture.concat(); // clone array

        let newBoard = newPast.pop();
        newFuture.push(newBoard);
        return {boardHistoryPast: newPast, boardHistoryFuture: newFuture, board: newBoard};
    },

    /** Redo */
    RedoBoard: () => (state: state.State) => {
        let newPast = state.boardHistoryPast.concat(); // clone array
        let newFuture = state.boardHistoryFuture.concat(); // clone array

        let newBoard = newFuture.pop();
        newPast.push(newBoard);
        return {boardHistoryPast: newPast, boardHistoryFuture: newFuture, board: newBoard};
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

    /** 集中力の値を変更 */
    setVigor: (p: {
        /** どちら側の集中力か */
        side: PlayerSide;
        /** 新しい集中力の値 */
        value: VigorValue;
    }) => (state: state.State) => {
        let newBoard = models.Board.clone(state.board);
        newBoard.vigors[p.side] = p.value;

        return {board: newBoard};
    },

    /** デッキのカードを設定する */
    setDeckCards: (p: {cardIds: string[]}) => (state: state.State, actions: typeof cardActions) => {
        p.cardIds.forEach((id) => {
            const data = CARD_DATA[id];
            if(data.baseType === 'normal'){
                actions.addCard({region: 'library', cardId: id});
            }
            if(data.baseType === 'special'){
                actions.addCard({region: 'special', cardId: id});
            }           
        });
    },

    /** ボードの状態を取得 */
    getState: () => (state: state.State) => state
}
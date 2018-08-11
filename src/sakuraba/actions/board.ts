import * as  _ from "lodash";
import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import { Megami, CARD_DATA } from "sakuraba";
import cardActions from './card';
import { ActionsType } from ".";

export default {
    /** ボード全体を設定する */
    setBoard: (newBoard: state.Board) => {
        return {board: newBoard};
    },

    /** ボード全体を初期化する */
    resetBoard: () => (state: state.State, actions: ActionsType) => {
        actions.memorizeBoardHistory(); // Undoのために履歴を記憶

        return {board: utils.createInitialState().board};
    },

    /** ボードの状態をUndo用に記憶 */
    memorizeBoardHistory: () => (state: state.State) => {
        return {boardHistoryPast: state.boardHistoryPast.concat([state.board]), boardHistoryFuture: []};
    },

    /** Undo */
    UndoBoard: () => (state: state.State) => {
        let newPast = state.boardHistoryPast.concat(); // clone array
        let newFuture = state.boardHistoryFuture.concat(); // clone array

        newFuture.push(state.board);
        let newBoard = newPast.pop();
        return {boardHistoryPast: newPast, boardHistoryFuture: newFuture, board: newBoard};
    },

    /** Redo */
    RedoBoard: () => (state: state.State) => {
        let newPast = state.boardHistoryPast.concat(); // clone array
        let newFuture = state.boardHistoryFuture.concat(); // clone array

        newPast.push(state.board);
        let newBoard = newFuture.pop();
        return {boardHistoryPast: newPast, boardHistoryFuture: newFuture, board: newBoard};
    },

    /** ボード履歴を削除して、Undo/Redoを禁止する */
    forgetBoardHistory: () => {
        return {boardHistoryPast: [], boardHistoryFuture: []};
    },

    /** 指定したサイドのプレイヤー名を設定する */
    setPlayerName: (p: {side: PlayerSide, name: string}) => (state: state.State) => {
        let newBoard = _.merge({}, state.board);
        newBoard.playerNames[p.side] = p.name;
        
        return {board: newBoard};
    },

    /** 指定したサイドのメガミを設定する */
    setMegamis: (p: {side: PlayerSide, megami1: Megami, megami2: Megami}) => (state: state.State, actions: ActionsType) => {
        actions.memorizeBoardHistory(); // Undoのために履歴を記憶

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
    }) => (state: state.State, actions: ActionsType) => {
        actions.memorizeBoardHistory(); // Undoのために履歴を記憶

        let newBoard = models.Board.clone(state.board);
        newBoard.vigors[p.side] = p.value;

        return {board: newBoard};
    },

    /** 萎縮フラグを変更 */
    setWitherFlag: (p: {
        /** どちら側の萎縮フラグか */
        side: PlayerSide;
        /** 新しい萎縮フラグの値 */
        value: boolean;
    }) => (state: state.State, actions: ActionsType) => {
        actions.memorizeBoardHistory(); // Undoのために履歴を記憶

        let newBoard = models.Board.clone(state.board);
        newBoard.witherFlags[p.side] = p.value;

        return {board: newBoard};
    },

    /** デッキのカードを設定する */
    setDeckCards: (p: {cardIds: string[]}) => (state: state.State, actions: ActionsType) => {
        actions.memorizeBoardHistory(); // Undoのために履歴を記憶

        // 自分の側のカードをすべて削除
        actions.clearDeckCards();

        // 選択されたカードを追加
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

    clearDeckCards: () => (state: state.State, actions: ActionsType) => {
        let board = models.Board.clone(state.board);
        _.remove(board.objects, o => (o.type === 'card' && o.side === state.side));
        board.updateRegionInfo();

        return {board: board};
    },

    /** ボードの状態を取得 */
    getState: () => (state: state.State) => state
}
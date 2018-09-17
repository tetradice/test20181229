import * as  _ from "lodash";
import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import { Megami, CARD_DATA } from "sakuraba";
import cardActions from './card';
import { ActionsType } from ".";

type LogParam = {text: string, visibility?: LogVisibility};

export default {
    /** 複数の操作を行い、必要に応じてUndo履歴、ログを設定。同時にソケットに変更後ボードを送信 */
    operate: (p: {
        /** 
         * 元に戻す履歴の処理タイプ
         * undoable - 元に戻すことが可能 (デフォルト)
         * notBack - 操作を行うと元に戻せなくなる (履歴も削除される)
         * ignore - 元に戻す対象とならない
         */
        undoType?: 'undoable' | 'notBack' | 'ignore';
        
        /**
         * 操作ログに記録する内容
         */
        log?: string | string[] | LogParam[];

        /**
         * 実行する処理の内容
         */
        proc: () => void;
    }) => (state: state.State, actions: ActionsType) => {
        // アクションログを追加し、追加されたログレコードを取得
        let appendLogs: state.LogRecord[] = null;

        if(p.log !== undefined){
            if(typeof p.log === 'string'){
                actions.appendActionLog({text: p.log});
            } else if(p.log.length >= 1){
                if(typeof p.log[0] === 'string'){
                    (p.log as string[]).forEach((text) => actions.appendActionLog({text: text}));
                } else {
                    (p.log as LogParam[]).forEach((log) => actions.appendActionLog({text: log.text, visibility: log.visibility}));
                }
            }
        }

        // メイン処理の実行
        p.proc();

        // 追加されたログだけを新しいステートから切り出す
        let newState = actions.getState();
        let oldLength = state.actionLog.length;
        appendLogs = newState.actionLog.slice(oldLength);

        // 処理の実行が終わったら、socket.ioで更新後のボードの内容と、アクションログを送信
        if(newState.socket){
            newState.socket.emit('updateBoard', { boardId: newState.boardId, side: newState.side, board: newState.board, appendedActionLogs: appendLogs });
        }

        // 履歴を忘れるモードの場合は、ボード履歴を削除し、元に戻せないようにする
        if(p.undoType === 'notBack'){
            actions.forgetBoardHistory();
        }

        // 履歴の更新 (履歴を記録するモードの場合のみ)
        if(p.undoType === undefined || p.undoType === 'undoable'){
            let newHist: state.BoardHistoryItem = {board: state.board, appendedLogs: appendLogs};
            return {boardHistoryPast: state.boardHistoryPast.concat([newHist]), boardHistoryFuture: []};
        } else {
            // 履歴の更新が必要ない場合はnullを返す
            return null;
        }
    },

    /** ボード全体を設定する */
    setBoard: (newBoard: state.Board) => {
        return {board: newBoard};
    },

    /** ボード全体を初期化する（プレイヤー名除く） */
    resetBoard: () => (state: state.State, actions: ActionsType) => {

        let extended: Partial<state.Board> = {playerNames: state.board.playerNames};
        return {board: _.extend(utils.createInitialState().board, extended)};
    },

    /** Undo */
    undoBoard: () => (state: state.State, actions: ActionsType) => {
        let newPast = state.boardHistoryPast.concat(); // clone array
        let newFuture = state.boardHistoryFuture.concat(); // clone array

        let recoveredHistItem = newPast.pop();
        newFuture.push({board: state.board, appendedLogs: recoveredHistItem.appendedLogs});

        // 処理の実行が終わったら、socket.ioで更新後のボードの内容と、アクションログを送信
        let appendLogs: state.LogRecord[] = [];
        let newActionLogs = actions.appendActionLog({text: `直前の操作を取り消しました`}).actionLog;
        let appendedLogs = [newActionLogs[newActionLogs.length - 1]];

        if(state.socket){
            state.socket.emit('updateBoard', { boardId: state.boardId, side: state.side, board: recoveredHistItem.board, appendedActionLogs: appendedLogs});
        }
        return {boardHistoryPast: newPast, boardHistoryFuture: newFuture, board: recoveredHistItem.board};
    },

    /** Redo */
    redoBoard: () => (state: state.State, actions: ActionsType) => {
        let newPast = state.boardHistoryPast.concat(); // clone array
        let newFuture = state.boardHistoryFuture.concat(); // clone array

        let recoveredHistItem = newFuture.pop();
        newPast.push({board: state.board, appendedLogs: recoveredHistItem.appendedLogs});

        // 処理の実行が終わったら、socket.ioで更新後のボードの内容と、アクションログを送信
        recoveredHistItem.appendedLogs.forEach(log => actions.appendActionLog({text: log.body, visibility: log.visibility}));

        if(state.socket){
            state.socket.emit('updateBoard', { boardId: state.boardId, side: state.side, board: recoveredHistItem.board, appendedActionLogs: recoveredHistItem.appendedLogs});
        }
        return {boardHistoryPast: newPast, boardHistoryFuture: newFuture, board: recoveredHistItem.board};
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
        let newBoard = _.merge({}, state.board);
        newBoard.megamis[p.side] = [p.megami1, p.megami2];
        
        return {board: newBoard};
    },

    /** 集中力の値を変更 */
    oprSetVigor: (p: {
        /** どちら側の集中力か */
        side: PlayerSide;
        /** 新しい集中力の値 */
        value: VigorValue;
    }) => (state: state.State, actions: ActionsType) => {
        let oldValue = state.board.vigors[p.side];

        // ログの内容を設定 (増加か減少かで変更)
        let logText: string;
        if(p.value >= oldValue){
            logText = `集中力を${p.value - oldValue}増やしました`;
        } else {
            logText = `集中力を${oldValue - p.value}減らしました`;
        }

        // 他の人の集中力を変更した場合
        if(p.side !== state.side){
            logText = `${state.board.playerNames[p.side]}の` + logText;
        }

        // 実行
        actions.operate({
            log: logText,
            proc: () => {
                actions.setVigor(p);
            }
        });
    }, 

    /** 集中力の値を変更 */
    setVigor: (p: {
        /** どちら側の集中力か */
        side: PlayerSide;
        /** 新しい集中力の値 */
        value: VigorValue;
    }) => (state: state.State, actions: ActionsType) => {
        let newBoard = models.Board.clone(state.board);
        newBoard.vigors[p.side] = p.value;

        return {board: newBoard};
    },

    /** 萎縮フラグを変更 */
    oprSetWitherFlag: (p: {
        /** どちら側の萎縮フラグか */
        side: PlayerSide;
        /** 新しい萎縮フラグの値 */
        value: boolean;
    }) => (state: state.State, actions: ActionsType) => {
        // ログの内容を設定
        let logText: string;
        if(p.value){
            if(p.side !== state.side){
                logText = `${state.board.playerNames[p.side]}を萎縮させました`;
            } else {
                logText = `萎縮しました`;
            }
        } else {
            if(p.side !== state.side){
                logText = `${state.board.playerNames[p.side]}の萎縮を解除しました`;
            } else {
                logText = `萎縮を解除しました`;
            }
        }

        // 実行
        actions.operate({
            log: logText,
            proc: () => {
                actions.setWitherFlag(p);
            }
        });
    }, 

    /** 萎縮フラグを変更 */
    setWitherFlag: (p: {
        /** どちら側の萎縮フラグか */
        side: PlayerSide;
        /** 新しい萎縮フラグの値 */
        value: boolean;
    }) => (state: state.State, actions: ActionsType) => {
        let newBoard = models.Board.clone(state.board);
        newBoard.witherFlags[p.side] = p.value;

        return {board: newBoard};
    },


    /** デッキのカードを設定する */
    setDeckCards: (p: {cardIds: string[]}) => (state: state.State, actions: ActionsType) => {
        // 自分の側のカードをすべて削除
        actions.clearDeckCards();

        // 選択されたカードを追加
        p.cardIds.forEach((id) => {
            const data = CARD_DATA[id];
            if(data.baseType === 'normal'){
                actions.addCard({side: state.side, region: 'library', cardId: id});
            }
            if(data.baseType === 'special'){
                actions.addCard({side: state.side, region: 'special', cardId: id});
            }           
        });
    },

    /** メガミを公開したフラグをセット */
    setMegamiOpenFlag: (p: {
        /** どちら側のフラグか */
        side: PlayerSide;
        /** 新しいフラグの値 */
        value: boolean;
    }) => (state: state.State, actions: ActionsType) => {
        let newBoard = models.Board.clone(state.board);
        newBoard.megamiOpenFlags[p.side] = p.value;

        return {board: newBoard};
    },

    /** 最初の手札を引いたフラグをセット */
    setFirstDrawFlag: (p: {
        /** どちら側のフラグか */
        side: PlayerSide;
        /** 新しいフラグの値 */
        value: boolean;
    }) => (state: state.State, actions: ActionsType) => {
        let newBoard = models.Board.clone(state.board);
        newBoard.firstDrawFlags[p.side] = p.value;

        return {board: newBoard};
    },

    /** マリガンフラグを変更 */
    setMariganFlag: (p: {
        /** どちら側のフラグか */
        side: PlayerSide;
        /** 新しいフラグの値 */
        value: boolean;
    }) => (state: state.State, actions: ActionsType) => {
        let newBoard = models.Board.clone(state.board);
        newBoard.mariganFlags[p.side] = p.value;

        return {board: newBoard};
    },

    /** 手札公開したフラグをセット */
    setHandOpenFlag: (p: {
        /** どちら側のフラグか */
        side: PlayerSide;
        /** 新しいフラグの値 */
        value: boolean;
    }) => (state: state.State, actions: ActionsType) => {
        let newBoard = models.Board.clone(state.board);
        // 手札公開フラグを変更
        newBoard.handOpenFlags[p.side] = p.value;

        // OFFにした場合、カード個別の公開フラグは初期化
        newBoard.handCardOpenFlags[p.side] = {};

        // 領域情報を更新
        newBoard.updateRegionInfo();

        return {board: newBoard};
    },

    /** 手札の個別カード公開したフラグをセット */
    setHandCardOpenFlag: (p: {
        /** どちら側のフラグか */
        side: PlayerSide;
        /** カードのオブジェクトID */
        cardId: string;
        /** 新しいフラグの値 */
        value: boolean;
    }) => (state: state.State, actions: ActionsType) => {
        let newBoard = models.Board.clone(state.board);
        // 手札公開フラグを変更
        newBoard.handCardOpenFlags[p.side][p.cardId] = p.value;

        // 領域情報を更新
        newBoard.updateRegionInfo();

        return {board: newBoard};
    },
    
    /** 最初の手札を引き、桜花結晶などを配置する */
    oprBoardSetup: () => (state: state.State, actions: ActionsType) => {
        actions.operate({
            undoType: 'notBack',
            proc: () => {
                let board = new models.Board(state.board);

                // 山札をシャッフル
                actions.shuffle({side: state.side});

                // 山札を3枚引く
                actions.draw({number: 3});

                // 桜花結晶を作り、同時に集中力をセット
                actions.addSakuraToken({side: state.side, region: 'aura', number: 3});
                actions.addSakuraToken({side: state.side, region: 'life', number: 10});
                actions.setVigor({side: state.side, value: 0});
                actions.appendActionLog({text: '桜花結晶と集中力を配置', visibility: 'shown'});

                // まだ間合が置かれていなければセット
                if(board.getRegionSakuraTokens(null, 'distance', null).length === 0){
                    actions.addSakuraToken({side: null, region: 'distance', number: 10});
                };

                // 最初の手札を引いたフラグをセット
                actions.setFirstDrawFlag({side: state.side, value: true});
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
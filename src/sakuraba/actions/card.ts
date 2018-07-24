import * as  _ from "lodash";
import * as models from "../models";
import * as utils from "../utils";
import { ActionsType } from ".";

export default {
    /** カードを1枚追加する */
    addCard: (p: {region: CardRegion, cardId: string}) => (state: state.State) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = new models.Board(state.board);

        // 現在カード数 + 1で新しい連番を振る
        let cardCount = newBoard.objects.filter(obj => obj.type === 'card').length;
        let objectId = `card-${cardCount + 1}`;

        let newCard = utils.createCard(objectId, p.cardId, p.region, 'p1');
        newBoard.objects.push(newCard);

        // 領域情報更新
        newBoard.updateRegionInfo();

        // 新しい盤を返す
        return {board: newBoard};
    },

    /** 指定領域のカードをクリアする */
    clearCards: (p: {region: CardRegion}) => (state: state.State) => {
        let newObjects = state.board.objects.filter(obj => (obj.type === 'card' && obj.region === p.region));
        let newBoard = _.merge({}, state.board, {objects: newObjects});

        // 新しい盤を返す
        return {board: newBoard};
    },

    /**
     * カードを指定領域から別の領域に移動させる
     */
    moveCard: (p: {
        /** 移動元の領域 */
        from: CardRegion;
        /** 何枚目のカードを移動するか。省略時は先頭 */
        fromIndex?: number;
        /** 移動先の領域 */
        to: CardRegion;
        /** 移動枚数 */
        moveNumber?: number;
    }) => (state: state.State) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = new models.Board(state.board);

        // カードを指定枚数移動 (省略時は0枚)
        let fromIndex = (p.fromIndex === undefined ? 0 : p.fromIndex);
        let num = (p.moveNumber === undefined ? 1 : p.moveNumber);
        let fromRegionCards = newBoard.getRegionCards(p.from).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
        let toRegionCards = newBoard.getRegionCards(p.to).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
        let indexes = toRegionCards.map(c => c.indexOfRegion);
        let maxIndex = Math.max(...indexes);

        let targetCards = fromRegionCards.slice(fromIndex, fromIndex + num);
        targetCards.forEach(c => {
            c.region = p.to;
            // 領域インデックスは最大値+1
            c.indexOfRegion = maxIndex + 1;
            maxIndex++;
        });

        // 領域情報の更新
        newBoard.updateRegionInfo();

        // 新しい盤を返す
        return {board: newBoard};
    },

    shuffle: () => (state: state.State) => {
        let ret: Partial<state.State> = {};

        let newBoard = new models.Board(state.board);
        // 山札のカードをすべて取得
        let cards = newBoard.getRegionCards('library');
        // ランダムに整列し、その順番をインデックスに再設定
        let shuffledCards = _.shuffle(cards);
        shuffledCards.forEach((c, i) => {
            c.indexOfRegion = i;
        });

        // 新しいボードを返す
        return {board: newBoard};
    },

    /** 再構成 */
    reshuffle: (p: {lifeDecrease?: boolean}) => (state: state.State, actions: ActionsType) => {
        // 使用済、伏せ札をすべて山札へ移動
        let newBoard = new models.Board(state.board);
        let usedCards = newBoard.getRegionCards('used');
        actions.moveCard({from: 'used', to: 'library', moveNumber: usedCards.length});
        
        newBoard = new models.Board(actions.getState().board);
        let hiddenUsedCards = newBoard.getRegionCards('hidden-used');
        actions.moveCard({from: 'hidden-used', to: 'library', moveNumber: hiddenUsedCards.length});

        // 山札を混ぜる
        actions.shuffle();
    },

    /** ドラッグ開始 */
    cardDragStart: (card: state.Card) => (state: state.State) => {
        let ret: Partial<state.State> = {};

        // ドラッグを開始したカードを設定
        ret.draggingFromCard = card;

        return ret;
    },

    
    /** ドラッグ中にカード領域の上に移動 */
    cardDragEnter: (region: CardRegion) => (state: state.State) => {
        let ret: Partial<state.State> = {};

        // ドラッグを開始したカードを設定
        ret.draggingHoverCardRegion = region;

        return ret;
    },
    
    /** ドラッグ中にカード領域の上から離れた */
    cardDragLeave: () => (state: state.State) => {
        let ret: Partial<state.State> = {};

        // ドラッグ中領域の初期化
        ret.draggingHoverCardRegion = null;

        return ret;
    },

    /** ドラッグ終了 */
    cardDragEnd: () => {
        let ret: Partial<state.State> = {};

        ret.draggingFromCard = null;
        ret.draggingHoverCardRegion = null;

        return ret;
    },
}
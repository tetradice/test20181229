import * as  _ from "lodash";
import * as models from "../models";

export default {
    /** カードを1枚追加する */
    addCard: (p: {region: CardRegion, cardId: string}) => (state: state.State) => {
        // 現在カード数 + 1で新しい連番を振る
        let cardCount = state.board.objects.filter(obj => obj.type === 'card').length;
        let objectId = `card-${cardCount + 1}`;

        // カードを1枚追加
        let newCard: state.Card = {type: "card", cardId: p.cardId, id: objectId, region: p.region, indexOfRegion: 0, side: 'p1', rotated: false, opened: false};
        let newObjects = state.board.objects.concat([]);
        newObjects.push(newCard);
        let newBoard = _.merge({}, state.board, {objects: newObjects});

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
        let fromRegionCards = newBoard.getRegionCards(p.from);
        let targetCards = fromRegionCards.slice(fromIndex, fromIndex + num);
        targetCards.forEach(c => {
            c.region = p.to;
        });

        // 領域情報の更新
        newBoard.updateRegionInfo();

        // 新しい盤を返す
        return {board: newBoard};
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
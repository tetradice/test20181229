import * as  _ from "lodash";
import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import { ActionsType } from ".";

export default {
    /** カードを1枚追加する */
    addCard: (p: {region: CardRegion, cardId: string}) => (state: state.State) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = models.Board.clone(state.board);

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
        /**
         * 移動元。下記のいずれかで指定
         * 1. プレイヤーサイドと領域の組み合わせ
         * 2. objectId
         */
        from: [PlayerSide, CardRegion] | string;
        /** 移動先。プレイヤーサイドと領域の組み合わせで指定 */
        to: [PlayerSide, CardRegion];
        /** 移動枚数 */
        moveNumber?: number;
        /** カードをスタックの先頭から出すか末尾から出すか。オブジェクトID未指定時に適用。省略時は末尾 */
        fromPosition?: 'first' | 'last';
        /** カードをスタックの先頭に入れるか末尾に入れるか。省略時は末尾 */
        toPosition?: 'first' | 'last';
    }) => (state: state.State, actions: ActionsType) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = models.Board.clone(state.board);

        // カードを指定枚数移動 (省略時は1枚)
        let num = (p.moveNumber === undefined ? 1 : p.moveNumber);

        let fromCards: state.Card[];
        if(typeof p.from === 'string'){
            fromCards = newBoard.objects.filter(o => o.type === 'card' && o.id === p.from) as state.Card[];
        } else {
            let [side, region] = p.from;
            let fromRegionCards = newBoard.getRegionCards(side, region).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
            if(p.fromPosition === 'first'){
                fromCards = fromRegionCards.slice(0, num);
            } else {
                fromCards = fromRegionCards.slice(num * -1);
            }
        }

        let [toSide, toRegion] = p.to;

        if(p.toPosition === 'first'){
            let i = -1;
    
            fromCards.forEach(c => {
                c.region = toRegion;
                c.indexOfRegion = i;
                i--;
            });
        } else {
            let toRegionCards = newBoard.getRegionCards(toSide, toRegion).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
            let indexes = toRegionCards.map(c => c.indexOfRegion);
            let maxIndex = Math.max(...indexes);
    
            fromCards.forEach(c => {
                c.region = toRegion;
                // 領域インデックスは最大値+1
                c.indexOfRegion = maxIndex + 1;
                maxIndex++;
            });
        }

        // 領域情報の更新
        newBoard.updateRegionInfo();

        // 新しい盤を返す
        return {board: newBoard};
    },

    /** 山札からカードを引く */
    oprDraw: (num?: number) => (state: state.State, actions: ActionsType) => {
        actions.operate({
            logText: `カードを${num}枚引く`,
            proc: () => {
                if(num === undefined) num = 1;
                actions.moveCard({from: [state.side, 'library'], to: [state.side, 'hand'], moveNumber: num});
            }
        });
    },

    flipCard: (objectId: string) => (state: state.State, actions: ActionsType) => {
        actions.memorizeBoardHistory(); // Undoのために履歴を記憶

        let ret: Partial<state.State> = {};
        let newBoard = models.Board.clone(state.board);

        let card = newBoard.getCard(objectId);
        if(card.type !== null){
            card.opened = !card.opened;
        }
        ret.board = newBoard;

        return ret;
    },



    /** 最初の手札を引く */
    firstDraw: (p: {
        /** どちら側の手札を引くか */
        side: PlayerSide;
    }) => (state: state.State, actions: ActionsType) => {
        actions.forgetBoardHistory(); // Undo履歴の削除

        // 山札をシャッフル
        actions.shuffle({side: p.side});

        // 手札を3枚引く
        actions.moveCard({from: [p.side, 'library'], to: [p.side, 'hand'], moveNumber: 3});

        // フラグON
        let newBoard = models.Board.clone(actions.getState().board);
        newBoard.firstDrawFlags[p.side] = true;

        return {board: newBoard};
    },

    shuffle: (p: {side: PlayerSide}) => (state: state.State, actions: ActionsType) => {
        let ret: Partial<state.State> = {};

        let newBoard = models.Board.clone(state.board);
        // 山札のカードをすべて取得
        let cards = newBoard.getRegionCards(p.side, 'library');
        // ランダムに整列し、その順番をインデックスに再設定
        let shuffledCards = _.shuffle(cards);
        shuffledCards.forEach((c, i) => {
            c.indexOfRegion = i;
        });

        // 新しいボードを返す
        return {board: newBoard};
    },

    /** 再構成操作 */
    oprReshuffle: (p: {side: PlayerSide, lifeDecrease?: boolean}) => (state: state.State, actions: ActionsType) => {
        actions.operate({
            undoType: 'notBack', // Undo不可
            logText: (p.lifeDecrease ? `再構成` : `再構成 (ライフ減少なし)`),
            proc: () => {
                // 使用済、伏せ札をすべて山札へ移動
                let newBoard = models.Board.clone(state.board);
                let usedCards = newBoard.getRegionCards(p.side, 'used');
                actions.moveCard({from: [p.side, 'used'], to: [p.side, 'library'], moveNumber: usedCards.length});
                
                newBoard = models.Board.clone(actions.getState().board);
                let hiddenUsedCards = newBoard.getRegionCards(p.side, 'hidden-used');
                actions.moveCard({from: [p.side, 'hidden-used'], to: [p.side, 'library'], moveNumber: hiddenUsedCards.length});

                // 山札を混ぜる
                actions.shuffle({side: p.side});
            }
        });
    },

    /** ドラッグ開始 */
    cardDragStart: (card: state.Card) => (state: state.State) => {
        let ret: Partial<state.State> = {};

        // ドラッグを開始したカードと、開始サイドを設定
        ret.draggingFromCard = card;

        return ret;
    },

    
    /** ドラッグ中にカード領域の上に移動 */
    cardDragEnter: (p: {side: PlayerSide, region: CardRegion}) => (state: state.State) => {
        let ret: Partial<state.State> = {};

        // 切札エリアからのドラッグや、切札エリアへのドラッグは禁止
        if(state.draggingFromCard.region === 'special' || p.region === 'special'){
            return null;
        }

        // ドラッグを開始した領域を設定
        ret.draggingHoverSide = p.side;
        ret.draggingHoverCardRegion = p.region;

        return ret;
    },
    
    /** ドラッグ中にカード領域の上から離れた */
    cardDragLeave: () => (state: state.State) => {
        let ret: Partial<state.State> = {};

        // ドラッグ中領域の初期化
        ret.draggingHoverSide = null;
        ret.draggingHoverCardRegion = null;

        return ret;
    },

    /** ドラッグ終了 */
    cardDragEnd: () => {
        let ret: Partial<state.State> = {};

        ret.draggingFromCard = null;
        ret.draggingHoverSide = null;
        ret.draggingHoverCardRegion = null;

        return ret;
    },
}
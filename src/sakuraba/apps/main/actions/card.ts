import * as  _ from "lodash";
import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import { ActionsType } from ".";
import { CARD_DATA } from "sakuraba";
import { t } from "i18next";

export default {
    /** カードを1枚追加する */
    addCard: (p: {side: PlayerSide, region: CardRegion, cardId: string}) => (state: state.State) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = models.Board.clone(state.board);

        // 現在カード数 + 1で新しい連番を振る
        let cardCount = newBoard.objects.filter(obj => obj.type === 'card').length;
        let objectId = `card-${cardCount + 1}`;

        let newCard = utils.createCard(objectId, p.cardId, p.region, p.side);
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
         * 1. プレイヤーサイドと領域と関連カードの組み合わせ
         * 2. objectId
         */
        from: [PlayerSide, CardRegion, string | null] | string;
        /** 移動先。プレイヤーサイドと領域と関連カードの組み合わせで指定 */
        to: [PlayerSide, CardRegion, string | null];
        /** 移動枚数 */
        moveNumber?: number;
        /** カードをスタックの先頭から出すか末尾から出すか、もしくは指定インデックスのカードを出すか。オブジェクトID未指定時に適用。省略時は末尾 */
        fromPosition?: 'first' | 'last' | number;
        /** カードをスタックの先頭に入れるか末尾に入れるか。省略時は末尾 */
        toPosition?: 'first' | 'last';
        /** カード名をアクションログに出力するか */
        cardNameLogging?: boolean
        /** カード名ログのタイトル */
        cardNameLogTitle?: string
    }) => (state: state.State, actions: ActionsType) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = models.Board.clone(state.board);

        // カードを指定枚数移動 (省略時は1枚)
        let num = (p.moveNumber === undefined ? 1 : p.moveNumber);

        let fromCards: state.Card[];
        if(typeof p.from === 'string'){
            fromCards = newBoard.objects.filter(o => o.type === 'card' && o.id === p.from) as state.Card[];
        } else {
            let [side, region, linkedCardId] = p.from;
            let fromRegionCards = newBoard.getRegionCards(side, region, linkedCardId).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
            if(p.fromPosition === 'first'){
                fromCards = fromRegionCards.slice(0, num);
            } else if(typeof p.fromPosition === 'number'){
                fromCards = fromRegionCards.slice(p.fromPosition, p.fromPosition + num);
            } else {
                fromCards = fromRegionCards.slice(num * -1);
            }
        }

        // 移動するカード名を記録
        if(p.cardNameLogging){
            let cardNames = fromCards.map((c) => `[${CARD_DATA[c.cardId].name}]`).join('、');
            let title = (p.cardNameLogTitle ? `${p.cardNameLogTitle} ` : '');
            actions.appendActionLog({text: `${title}-> ${cardNames}`, visibility: 'ownerOnly'});
        }

        let [toSide, toRegion, toLinkedCardId] = p.to;

        if(p.toPosition === 'first'){
            let i = -1;
    
            fromCards.forEach(c => {
                c.side = toSide;
                c.region = toRegion;
                c.indexOfRegion = i;
                c.linkedCardId = toLinkedCardId;
                i--;
            });
        } else {
            let toRegionCards = newBoard.getRegionCards(toSide, toRegion, toLinkedCardId).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
            let indexes = toRegionCards.map(c => c.indexOfRegion);
            let maxIndex = Math.max(...indexes);
    
            fromCards.forEach(c => {
                c.side = toSide;
                c.region = toRegion;
                // 領域インデックスは最大値+1
                c.indexOfRegion = maxIndex + 1;
                c.linkedCardId = toLinkedCardId;
                maxIndex++;
            });
        }

        // 領域情報の更新
        newBoard.updateRegionInfo();

        // 新しい盤を返す
        return {board: newBoard};
    },

    /** 山札からカードを引く */
    draw: (p: {number?: number, cardNameLogging?: boolean}) => (state: state.State, actions: ActionsType) => {
        if(state.side === 'watcher') throw `Forbidden operation for watcher`  // 観戦者は呼び出し不可能な操作

        if(p.number === undefined) p.number = 1;
        actions.moveCard({
              from: [state.side, 'library', null]
            , to: [state.side, 'hand', null]
            , moveNumber: p.number
            , cardNameLogging: p.cardNameLogging
        });
    },

    /** 山札からカードを引く操作実行 */
    oprDraw: (p: {number?: number, cardNameLogging?: boolean}) => (state: state.State, actions: ActionsType) => {
        actions.operate({
            log: ['log:カードをN枚引きました', {count: (p.number === undefined ? 1 : p.number)}],
            proc: () => {
                actions.draw(p);
            }
        });
    },

    /** 切り札の使用済状態を変更する */
    setSpecialUsed: (p: {objectId: string, value: boolean}) => (state: state.State, actions: ActionsType) => {

        let ret: Partial<state.State> = {};
        let newBoard = models.Board.clone(state.board);

        let card = newBoard.getCard(p.objectId);
        card.specialUsed = p.value
        // 領域情報を更新
        newBoard.updateRegionInfo();

        return {board: newBoard};
    },

    /** 切り札の表裏を変更する */
    oprSetSpecialUsed: (p: {objectId: string, value: boolean}) => (state: state.State, actions: ActionsType) => {
        let board = new models.Board(state.board);
        let card = board.getCard(p.objectId);

        // 桜花結晶が乗っている切札を、変更しようとした場合はエラー
        let onCardTokens = board.getRegionSakuraTokens(card.side, 'on-card', card.id);
        if(onCardTokens.length >= 1){
            utils.messageModal(t("桜花結晶が上に乗っている切札は、裏向きにできません。"));
            return;
        }

        actions.operate({
            log: [(p.value ? 'log:切札[CARDNAME]を表向きにしました' : 'log:切札[CARDNAME]を裏返しました'), {cardName: {type: 'cardName', cardSet: 'na-s2', cardId: card.cardId}}],
            proc: () => {
                actions.setSpecialUsed(p);
            }
        });
    },


    /** カードを取り除く */
    removeCard: (p: {objectId: string}) => (state: state.State, actions: ActionsType) => {
        let ret: Partial<state.State> = {};
        let newBoard = models.Board.clone(state.board);

        newBoard.objects = newBoard.objects.filter(o => o.id !== p.objectId);
        // 領域情報を更新
        newBoard.updateRegionInfo();

        return {board: newBoard};
    },

    /** カードを取り除く */
    oprRemoveCard: (p: {objectId: string}) => (state: state.State, actions: ActionsType) => {
        let board = new models.Board(state.board);
        let card = board.getCard(p.objectId);

        actions.operate({
            log: ['log:[CARDNAME]をボード上から取り除きました', {cardName: {type: 'cardName', cardSet: 'na-s2', cardId: card.cardId}}],
            proc: () => {
                actions.removeCard(p);
            }
        });
    },

    /** 帯電解除 */
    discharge: (p: {objectId: string}) => (state: state.State, actions: ActionsType) => {
        let ret: Partial<state.State> = {};
        let newBoard = models.Board.clone(state.board);

        let card = newBoard.getCard(p.objectId);
        card.discharged = true;

        // 領域情報を更新
        newBoard.updateRegionInfo();

        return {board: newBoard};
    },

    /** 帯電解除＋ゲージ増加操作を実行 */
    oprDischarge: (p: {objectId: string, guageType: 'wind' | 'thunder'}) => (state: state.State, actions: ActionsType) => {
        let board = new models.Board(state.board);
        let card = board.getCard(p.objectId);

        actions.operate({
            log: ['log:[CARDNAME]の帯電を解除し、GUAGEを1上げました', {cardName: {type: 'cardName', cardSet: 'na-s2', cardId: card.cardId}, guage: [(p.guageType === 'wind' ? '風神ゲージ' : '雷神ゲージ'), null]}],
            proc: () => {
                // 帯電解除
                actions.discharge(p);

                // ゲージ増加
                if(p.guageType === 'wind') actions.incrementWindGuage({side: card.side});
                if(p.guageType === 'thunder') actions.incrementThunderGuage({side: card.side});
            }
        });
    },

    shuffle: (p: {side: PlayerSide}) => (state: state.State, actions: ActionsType) => {
        let ret: Partial<state.State> = {};

        let newBoard = models.Board.clone(state.board);
        // 山札のカードをすべて取得し、毒と毒以外のカードに分ける
        let cards = newBoard.getRegionCards(p.side, 'library', null);
        let normalCards = cards.filter(c => !CARD_DATA[c.cardId].poison);
        let poisonCards = cards.filter(c => CARD_DATA[c.cardId].poison);
        // ランダムに整列し、その順番をインデックスに再設定
        let shuffledNormalCards = _.shuffle(normalCards);
        let shuffledPoisonCards = _.shuffle(poisonCards);
        // 通常カードを下、毒カードを上に並べる
        let lastNormalCardIndex = 0;
        shuffledNormalCards.forEach((c, i) => {
            c.indexOfRegion = i;
            lastNormalCardIndex = i;
        });
        shuffledPoisonCards.forEach((c, i) => {
            c.indexOfRegion = lastNormalCardIndex + 1 + i;
        });

        // 新しいボードを返す
        return {board: newBoard};
    },

    /** 再構成操作 */
    oprReshuffle: (p: {side: PlayerSide, lifeDecrease: boolean}) => (state: state.State, actions: ActionsType) => {
        let boardModel = new models.Board(state.board);

        // 使用済み札の下に封印されたカードが1枚でもあれば、再構成はできない
        let usedCards = boardModel.getRegionCards(p.side, 'used', null);
        if(usedCards.find(c => boardModel.getSealedCards(c.id).length >= 1)){
            utils.messageModal(t('使用済み札の下に封印されているカードがあるため、再構成を行えません。').replace(/\n/g, '<br>'));
            return;
        }
        
        actions.operate({
            undoType: 'notBack', // Undo不可
            log: [(p.lifeDecrease ? `log:再構成しました(ライフ-1)` : `log:ライフ減少なしで再構成しました`), null],
            proc: () => {
                // （桜花結晶が上に乗っていない）使用済札、伏せ札をすべて山札へ移動。ただしTransformカードは除外
                let newBoard = models.Board.clone(state.board);
                let usedCards = newBoard.getRegionCards(p.side, 'used', null);
                usedCards.forEach(card => {
                    let data = CARD_DATA[card.cardId];
                    if(newBoard.getRegionSakuraTokens(p.side, 'on-card', card.id).length === 0 && data.baseType !== 'transform'){
                        actions.moveCard({from: card.id, to: [p.side, 'library', null]});
                    }
                });

                newBoard = models.Board.clone(actions.getState().board);
                let hiddenUsedCards = newBoard.getRegionCards(p.side, 'hidden-used', null);
                actions.moveCard({from: [p.side, 'hidden-used', null], to: [p.side, 'library', null], moveNumber: hiddenUsedCards.length});

                // 山札を混ぜる
                actions.shuffle({side: p.side});

                // ライフ-1
                if(p.lifeDecrease){
                    actions.moveSakuraToken({from: [p.side, 'life', null], to: [p.side, 'flair', null]});
                }
            }
        });
    },
}
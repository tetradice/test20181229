import * as  _ from "lodash";
import * as models from "sakuraba/models";
import * as utils from "sakuraba/utils";
import { ActionsType } from ".";
import { CARD_DATA } from "sakuraba";

export default {
    /** 桜花結晶を指定数追加する */
    addSakuraToken: (p: {side: PlayerSide, region: SakuraTokenRegion, number: number, artificial?: boolean, ownerSide?: PlayerSide}) => (state: state.State) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = models.Board.clone(state.board);

        // 指定数分繰り返す
        _.times(p.number, () => {
            // 現在桜花結晶数 + 1で新しい連番を振る
            let tokenCount = newBoard.objects.filter(obj => obj.type === 'sakura-token').length;
            let objectId = `sakuraToken-${tokenCount + 1}`;

            let newToken = utils.createSakuraToken(objectId, p.region, p.side);
            newToken.artificial = p.artificial;
            if(p.ownerSide) newToken.ownerSide = p.ownerSide;
            newBoard.objects.push(newToken);
        });


        // 領域情報更新
        newBoard.updateRegionInfo();

        // 新しい盤を返す
        return {board: newBoard};
    },

    /**
     * カードを指定領域から別の領域に移動させる
     */
    moveSakuraToken: (p: {
        /** 移動元 */
        from: [PlayerSide, SakuraTokenRegion, string];
        /** 移動元のグループ */
        fromGroup?: state.SakuraTokenGroup;
        /** 移動先 */
        to: [PlayerSide, SakuraTokenRegion, string];
        /** 移動数 */
        moveNumber?: number;
        /** 間合-1トークンとして動かす (造花結晶用) 省略時やfalse指定時は通常のトークンに戻る */
        distanceMinus?: boolean;
    }) => (state: state.State) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = models.Board.clone(state.board);

        // 桜花結晶数を指定枚数移動 (省略時は0枚)
        let num = (p.moveNumber === undefined ? 1 : p.moveNumber);
        let fromRegionSakuraTokens = newBoard.getRegionSakuraTokens(p.from[0], p.from[1], p.from[2]);
        if(p.fromGroup){
            fromRegionSakuraTokens = fromRegionSakuraTokens.filter(t => t.group === p.fromGroup)
        }
        fromRegionSakuraTokens = fromRegionSakuraTokens.sort((a, b) => a.indexOfRegion - b.indexOfRegion);
        let toRegionSakuraTokens = newBoard.getRegionSakuraTokens(p.to[0], p.to[1], p.to[2]).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
        let indexes = toRegionSakuraTokens.map(c => c.indexOfRegion);
        let maxIndex = Math.max(...indexes);
        if(indexes.length === 0) maxIndex = 0;

        let targetSakuraTokens = fromRegionSakuraTokens.slice(0, num);
        targetSakuraTokens.forEach(c => {
            c.side = p.to[0];
            c.region = p.to[1];
            c.linkedCardId = p.to[2];
            // 領域インデックスは最大値+1
            c.indexOfRegion = maxIndex + 1;
            c.distanceMinus = (p.distanceMinus ? true : false);
            maxIndex++;
        });

        // 領域情報の更新
        newBoard.updateRegionInfo();

        // 新しい盤を返す
        return {board: newBoard};
    },

    /**
     * 全付与札の上から桜花結晶を1つ取り除く操作
     */
    oprRemoveSakuraTokenfromAllEnhanceCard: () => (state: state.State, actions: ActionsType) => {
        actions.operate({
            log: `全付与札の桜花結晶を-1しました`,
            proc: () => {
                let boardModel = new models.Board(state.board);

                // 桜花結晶が乗っているすべての付与札を取得
                let tokensOnCard = state.board.objects.filter(o => o.type === 'sakura-token' && o.region === 'on-card') as state.SakuraToken[];
                let cardIds = _.uniq(tokensOnCard.map(t => t.linkedCardId));

                // 付与札1つごとに、桜花結晶をダストへ移動
                cardIds.forEach(cardId => {
                    let card = boardModel.getCard(cardId);
                    let tokens = boardModel.getRegionSakuraTokens(card.side, 'on-card', cardId);
                    actions.moveSakuraToken({
                        from: [card.side, 'on-card', cardId]
                        , to: [null, 'dust', null]
                    });

                    // 桜花結晶が0になる付与札があれば、カード名を出力
                    console.log(tokens);
                    if(tokens.length === 1){
                        let cardData = CARD_DATA[card.cardId];
                        actions.appendActionLog({text: `-> [${cardData.name}]の上の桜花結晶数が0になりました`});
                    }
                });
            }
        });
    },

    /** 騎動前進 */
    oprRideForward: (p: {side: PlayerSide, moveNumber: number}) => (state: state.State, actions: ActionsType) => {
        let numPrefix = (p.moveNumber === 1 ? '' : `${p.moveNumber}回`);
        actions.operate({
            log: (p.side === state.side ? `${numPrefix}騎動前進しました` : `相手を${numPrefix}騎動前進させました`),
            proc: () => {
                actions.moveSakuraToken({ from: [p.side, 'machine', null], to: [null, 'distance', null], distanceMinus: true, moveNumber: p.moveNumber });
            }
        });
    },

    /** 騎動後退 */
    oprRideBack: (p: {side: PlayerSide, moveNumber: number}) => (state: state.State, actions: ActionsType) => {
        let numPrefix = (p.moveNumber === 1 ? '' : `${p.moveNumber}回`);
        actions.operate({
            log: (p.side === state.side ? `${numPrefix}騎動後退しました` : `相手を${numPrefix}回騎動後退させました`),
            proc: () => {
                actions.moveSakuraToken({from: [p.side, 'machine', null], to: [null, 'distance', null], distanceMinus: false, moveNumber: p.moveNumber});
            }
        });
    },
}
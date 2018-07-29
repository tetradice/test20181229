import * as  _ from "lodash";
import * as models from "../models";
import * as utils from "../utils";
import { ActionsType } from ".";

export default {
    /** 桜花結晶を指定数追加する */
    addSakuraToken: (p: {region: SakuraTokenRegion, number: number}) => (state: state.State) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = models.Board.clone(state.board);

        // 指定数分繰り返す
        _.times(p.number, () => {
            // 現在桜花結晶数 + 1で新しい連番を振る
            let tokenCount = newBoard.objects.filter(obj => obj.type === 'sakura-token').length;
            let objectId = `sakuraToken-${tokenCount + 1}`;

            let newToken = utils.createSakuraToken(objectId, p.region, 'p1');
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
        /** 移動元のサイド */
        fromSide: PlayerSide;
        /** 移動元の領域 */
        from: SakuraTokenRegion;
        /** 移動先のサイド */
        toSide: PlayerSide;
        /** 移動先の領域 */
        to: SakuraTokenRegion;
        /** 移動数 */
        moveNumber?: number;
    }) => (state: state.State) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = models.Board.clone(state.board);

        // 桜花結晶数を指定枚数移動 (省略時は0枚)
        let num = (p.moveNumber === undefined ? 1 : p.moveNumber);
        let fromRegionSakuraTokens = newBoard.getRegionSakuraTokens(p.fromSide, p.from).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
        let toRegionSakuraTokens = newBoard.getRegionSakuraTokens(p.toSide, p.to).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
        let indexes = toRegionSakuraTokens.map(c => c.indexOfRegion);
        let maxIndex = Math.max(...indexes);

        let targetSakuraTokens = fromRegionSakuraTokens.slice(0, num);
        targetSakuraTokens.forEach(c => {
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

    /** ドラッグ開始 */
    sakuraTokenDragStart: (sakuraToken: state.SakuraToken) => (state: state.State) => {
        let ret: Partial<state.State> = {};

        // ドラッグを開始したカードを設定
        ret.draggingFromSakuraToken = sakuraToken;

        return ret;
    },
    
    /** ドラッグ中にカード領域の上に移動 */
    sakuraTokenDragEnter: (region: SakuraTokenRegion) => (state: state.State) => {
        let ret: Partial<state.State> = {};

        // ドラッグを開始したカードを設定
        ret.draggingHoverSakuraTokenRegion = region;

        return ret;
    },
    
    /** ドラッグ中にカード領域の上から離れた */
    sakuraTokenDragLeave: () => (state: state.State) => {
        let ret: Partial<state.State> = {};

        // ドラッグ中領域の初期化
        ret.draggingHoverSakuraTokenRegion = null;

        return ret;
    },

    /** ドラッグ終了 */
    sakuraTokenDragEnd: () => {
        let ret: Partial<state.State> = {};

        ret.draggingFromSakuraToken = null;
        ret.draggingHoverSakuraTokenRegion = null;

        return ret;
    },
}
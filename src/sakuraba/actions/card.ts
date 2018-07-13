import * as  _ from "lodash";

export default {
    /** カードを1枚追加する */
    addCard: (args: {region: CardRegion, cardId: string}) => (state: state.State) => {
        // 現在カード数 + 1で新しい連番を振る
        let cardCount = state.board.objects.filter(obj => obj.type === 'card').length;
        let objectId = `card-${cardCount + 1}`;

        // カードを1枚追加
        let newCard: state.Card = {type: "card", cardId: args.cardId, id: objectId, region: args.region, indexOfRegion: 0, side: 'p1', rotated: false, opened: false};
        let newObjects = state.board.objects.concat([]);
        newObjects.push(newCard);
        let newBoard = _.merge({}, state.board, {objects: newObjects});

        // 新しい盤を返す
        return {board: newBoard};
    },

    /** 指定領域のカードをクリアする */
    clearCards: (args: {region: CardRegion}) => (state: state.State) => {
        let newObjects = state.board.objects.filter(obj => (obj.type === 'card' && obj.region === args.region));
        let newBoard = _.merge({}, state.board, {objects: newObjects});

        // 新しい盤を返す
        return {board: newBoard};
    }
}
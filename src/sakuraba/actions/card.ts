import * as  _ from "lodash";

export default {
    /** カードを1枚追加する */
    addCard: (region: string, cardId: string) => (state: state.State) => {
        console.log(state);

        // 現在カード数 + 1で新しい連番を振る
        let cardCount = Object.keys(state.board.objects).filter(key => state.board.objects[key].type === 'card').length;
        let objectId = `card-${cardCount + 1}`;

        // カードを1枚追加
        let newCard: state.Card = {type: "card", id: objectId, region: region, indexOfRegion: 0, side: 1};
        let newObjects = {};
        newObjects[objectId] = newCard;
        let newBoard = _.merge({}, state.board, {objects: newObjects});

        // 新しい盤を返す
        return {board: newBoard};
    }
}
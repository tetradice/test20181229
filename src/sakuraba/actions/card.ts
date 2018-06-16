export default {
    /** カードを指定した領域へ1枚追加する */
    addCard: (region: string, cardId: string) => (state: state.State) => {
        // 現在カード数 + 1で連番を振る
        let cardCount = Object.keys(state.board.objects).filter(key => state.board.objects[key].type === 'card').length;
        let objectId = `card-${cardCount + 1}`;

        // カードを1枚追加
        let newCard: state.Card = {type: "card", id: objectId, region: region, indexOfRegion: 0, side: 1};
        return {
            board: {
                objects: []
            }
        };
    }
}




